import { toPng, toJpeg } from "html-to-image"
import { formatHour, formatTime, formatDateString } from "@/lib/time-utils"

export type ExportFormat = "png" | "jpg" | "pdf"

// Event type for PDF export
export interface PdfEvent {
    id: string
    title: string
    description: string
    date: string // YYYY-MM-DD
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    color?: string
}

// PDF export settings
export interface PdfExportSettings {
    workingHoursStart: number
    workingHoursEnd: number
    weekStartsOnSunday: boolean
    use12HourFormat: boolean
}

// RGB colors for PDF (jsPDF uses RGB values 0-255)
const PDF_COLORS: Record<string, { bg: [number, number, number]; border: [number, number, number]; text: [number, number, number] }> = {
    blue: { bg: [219, 234, 254], border: [59, 130, 246], text: [29, 78, 216] },
    green: { bg: [220, 252, 231], border: [34, 197, 94], text: [21, 128, 61] },
    red: { bg: [254, 226, 226], border: [239, 68, 68], text: [185, 28, 28] },
    yellow: { bg: [254, 249, 195], border: [234, 179, 8], text: [161, 98, 7] },
    purple: { bg: [243, 232, 255], border: [168, 85, 247], text: [126, 34, 206] },
    pink: { bg: [252, 231, 243], border: [236, 72, 153], text: [190, 24, 93] },
    orange: { bg: [255, 237, 213], border: [249, 115, 22], text: [194, 65, 12] },
    teal: { bg: [204, 251, 241], border: [20, 184, 166], text: [15, 118, 110] },
}

interface ExportOptions {
    element: HTMLElement
    filename: string
    format: ExportFormat
    scale?: number
    watermark?: string
}

interface VectorPdfOptions {
    filename: string
    events: PdfEvent[]
    settings: PdfExportSettings
    currentWeekStart: Date
    viewMode: 'week' | 'day'
    selectedDate?: Date
}

/**
 * Download a data URL as a file
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Add watermark to a data URL and return new data URL
 */
async function addWatermarkToDataUrl(
    dataUrl: string,
    text: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                reject(new Error("Failed to get canvas context"))
                return
            }

            ctx.drawImage(img, 0, 0)

            const fontSize = Math.max(28, Math.floor(canvas.width / 35))
            ctx.font = `bold ${fontSize}px Arial, sans-serif`
            ctx.fillStyle = "rgba(100, 116, 139, 0.65)"
            ctx.textAlign = "right"
            ctx.textBaseline = "bottom"
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)"
            ctx.shadowBlur = 3
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetY = 1

            const padding = Math.max(25, Math.floor(canvas.width / 40))
            ctx.fillText(text, canvas.width - padding, canvas.height - padding)

            resolve(canvas.toDataURL("image/png"))
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = dataUrl
    })
}

/**
 * Export schedule to image using html-to-image
 */
export async function exportScheduleToImage(
    options: ExportOptions
): Promise<void> {
    const { element, filename, format, scale = 2, watermark } = options

    try {
        const exportFn = format === "jpg" ? toJpeg : toPng
        let dataUrl = await exportFn(element, {
            pixelRatio: scale,
            backgroundColor: "#ffffff",
            skipFonts: true,
            filter: (node) => {
                if (!(node instanceof Element)) return true
                const tagName = node.tagName?.toLowerCase()
                if (tagName === "script" || tagName === "noscript") return false
                if (tagName === "button") {
                    const text = node.textContent?.trim().toLowerCase()
                    if (text === "today") return false
                    if (node.querySelector("svg")) {
                        const parent = node.parentElement
                        if (parent && parent.querySelector("h2")) return false
                    }
                }
                return true
            },
        })

        if (watermark) {
            dataUrl = await addWatermarkToDataUrl(dataUrl, watermark)
        }

        const extension = format === "jpg" ? "jpg" : "png"
        downloadDataUrl(dataUrl, `${filename}.${extension}`)
    } catch (error) {
        console.error("Export failed:", error)
        throw new Error("Failed to export schedule")
    }
}

/**
 * Generate filename with date
 */
export function generateFilename(prefix: string = "schedule"): string {
    const date = new Date()
    const dateStr = date.toISOString().split("T")[0]
    return `${prefix}-${dateStr}`
}



/**
 * Get week dates starting from a given date
 */
function getWeekDatesForPdf(weekStart: Date): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        dates.push(date)
    }
    return dates
}



/**
 * Check if text contains non-ASCII characters (Chinese, etc.)
 */
function containsNonAscii(text: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /[^\x00-\x7F]/.test(text)
}

/**
 * Sanitize text for PDF - replace non-ASCII with placeholder or transliterate
 */
function sanitizeTextForPdf(text: string): string {
    if (!containsNonAscii(text)) {
        return text
    }
    // For non-ASCII text, we'll show it as-is and let jsPDF try to render
    // In practice, jsPDF will show boxes/question marks for unsupported chars
    // A workaround is to use unicode escape or just show [Text]
    return text // Keep original - will be rendered with available glyphs
}

/**
 * Export schedule to PDF (Pro feature) - True Vector Format
 * Uses jsPDF drawing API to create native vector graphics
 */
export async function exportScheduleToPdf(
    options: VectorPdfOptions
): Promise<void> {
    const { jsPDF } = await import("jspdf")
    const { filename, events, settings, currentWeekStart, viewMode, selectedDate } = options
    const { workingHoursStart, workingHoursEnd, weekStartsOnSunday, use12HourFormat } = settings

    try {
        // Create PDF in landscape A4
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 10

        // Calculate grid dimensions - increased header space
        const headerHeight = 25 // More space for header
        const gridLeft = margin + 22 // Space for time labels
        const gridTop = margin + headerHeight // More space for header
        const gridWidth = pageWidth - gridLeft - margin
        const gridHeight = pageHeight - gridTop - margin - 5

        // Calculate hours and rows
        const hours: number[] = []
        for (let h = workingHoursStart; h <= workingHoursEnd; h++) {
            hours.push(h)
        }
        const numRows = hours.length - 1
        const rowHeight = gridHeight / numRows

        // Calculate columns based on view mode
        const numCols = viewMode === 'week' ? 7 : 1
        const colWidth = gridWidth / numCols

        // Get week dates or single date
        const dates = viewMode === 'week'
            ? getWeekDatesForPdf(currentWeekStart)
            : [selectedDate || new Date()]

        // Day names
        const dayNames = weekStartsOnSunday
            ? ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
            : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

        // ===== DRAW HEADER (Date Range) =====
        pdf.setFontSize(14)
        pdf.setTextColor(31, 41, 55) // gray-800

        // Format date range
        let headerText: string
        if (viewMode === 'week') {
            const startDate = dates[0]
            const endDate = dates[6]
            const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' })
            const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' })
            if (startMonth === endMonth) {
                headerText = `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`
            } else {
                headerText = `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`
            }
        } else {
            const d = dates[0]
            headerText = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        }

        pdf.text(headerText, pageWidth / 2, margin + 7, { align: 'center' })

        // ===== DRAW COLUMN HEADERS (Day names + dates) =====
        for (let col = 0; col < numCols; col++) {
            const x = gridLeft + col * colWidth + colWidth / 2
            const date = dates[col]
            const dayName = dayNames[col]

            // Day name (e.g., MON)
            pdf.setFontSize(9)
            pdf.setTextColor(107, 114, 128) // gray-500
            pdf.text(dayName, x, gridTop - 8, { align: 'center' })

            // Date number
            pdf.setFontSize(12)
            pdf.setTextColor(31, 41, 55) // gray-800
            pdf.text(date.getDate().toString(), x, gridTop - 2, { align: 'center' })
        }

        // ===== DRAW GRID LINES =====
        pdf.setDrawColor(209, 213, 219) // gray-300
        pdf.setLineWidth(0.3)

        // Horizontal lines (time rows)
        for (let row = 0; row <= numRows; row++) {
            const y = gridTop + row * rowHeight
            pdf.line(gridLeft, y, gridLeft + gridWidth, y)
        }

        // Vertical lines (columns)
        for (let col = 0; col <= numCols; col++) {
            const x = gridLeft + col * colWidth
            pdf.line(x, gridTop, x, gridTop + gridHeight)
        }

        // ===== DRAW TIME LABELS =====
        pdf.setFontSize(8)
        pdf.setTextColor(107, 114, 128) // gray-500
        for (let row = 0; row < hours.length; row++) {
            const y = gridTop + row * rowHeight
            const timeText = formatHour(hours[row], use12HourFormat)
            pdf.text(timeText, gridLeft - 3, y + 1, { align: 'right' })
        }

        // ===== DRAW EVENTS =====
        for (let col = 0; col < numCols; col++) {
            const dateStr = formatDateString(dates[col])
            const dayEvents = events.filter(e => e.date === dateStr)

            for (const event of dayEvents) {
                // Calculate event position
                const startMinutes = (event.startHour - workingHoursStart) * 60 + event.startMinute
                const endMinutes = (event.endHour - workingHoursStart) * 60 + event.endMinute
                const totalMinutes = (workingHoursEnd - workingHoursStart) * 60

                const eventTop = gridTop + (startMinutes / totalMinutes) * gridHeight
                const eventHeight = ((endMinutes - startMinutes) / totalMinutes) * gridHeight
                const eventLeft = gridLeft + col * colWidth + 1
                const eventWidth = colWidth - 2

                // Skip events outside visible range
                if (eventTop >= gridTop + gridHeight || eventTop + eventHeight <= gridTop) {
                    continue
                }

                // Get colors
                const colorKey = event.color || 'blue'
                const colors = PDF_COLORS[colorKey] || PDF_COLORS.blue

                const actualEventHeight = Math.max(eventHeight, 8)

                // Draw event background
                pdf.setFillColor(...colors.bg)
                pdf.roundedRect(eventLeft, eventTop, eventWidth, actualEventHeight, 1, 1, 'F')

                // Draw left border
                pdf.setFillColor(...colors.border)
                pdf.rect(eventLeft, eventTop, 1.5, actualEventHeight, 'F')

                // Calculate text positions - Title at top, description in middle, time at bottom
                const textLeft = eventLeft + 4
                const maxTextWidth = eventWidth - 6

                // Title at top
                pdf.setFontSize(8)
                pdf.setTextColor(...colors.text)
                let displayTitle = sanitizeTextForPdf(event.title)
                while (pdf.getTextWidth(displayTitle) > maxTextWidth && displayTitle.length > 3) {
                    displayTitle = displayTitle.slice(0, -1)
                }
                if (displayTitle.length < event.title.length) {
                    displayTitle = displayTitle.slice(0, -2) + '...'
                }
                pdf.text(displayTitle, textLeft, eventTop + 4)

                // Description in middle (if space allows)
                if (eventHeight > 14 && event.description) {
                    pdf.setFontSize(6)
                    let desc = sanitizeTextForPdf(event.description)
                    while (pdf.getTextWidth(desc) > maxTextWidth && desc.length > 3) {
                        desc = desc.slice(0, -1)
                    }
                    if (desc.length < event.description.length) {
                        desc = desc.slice(0, -2) + '...'
                    }
                    pdf.text(desc, textLeft, eventTop + 9)
                }

                // Time at bottom
                if (eventHeight > 10) {
                    pdf.setFontSize(6)
                    const timeStr = `${formatTime(event.startHour, event.startMinute, use12HourFormat)} - ${formatTime(event.endHour, event.endMinute, use12HourFormat)}`
                    // Position time at the bottom of the card
                    const timeY = eventTop + actualEventHeight - 2
                    pdf.text(timeStr, textLeft, timeY)
                }
            }
        }

        // Save the PDF
        pdf.save(`${filename}.pdf`)
    } catch (error) {
        console.error("PDF export failed:", error)
        throw new Error("Failed to export schedule to PDF")
    }
}

/**
 * CSV Export Options
 */
interface CsvExportOptions {
    filename: string
    events: PdfEvent[]
    settings: PdfExportSettings
}



/**
 * Get day name from date
 */
function getDayName(dateStr: string): string {
    const date = new Date(dateStr)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
}

/**
 * Calculate duration in hours and minutes
 */
function calculateDuration(startHour: number, startMinute: number, endHour: number, endMinute: number): string {
    const startTotalMinutes = startHour * 60 + startMinute
    const endTotalMinutes = endHour * 60 + endMinute
    const durationMinutes = endTotalMinutes - startTotalMinutes
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    if (hours === 0) {
        return `${minutes}min`
    } else if (minutes === 0) {
        return `${hours}h`
    }
    return `${hours}h ${minutes}min`
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCsvField(field: string): string {
    // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
        return `"${field.replace(/"/g, '""')}"`
    }
    return field
}

/**
 * Export schedule to CSV (Pro feature)
 * Creates a CSV file with all events sorted by date and time
 */
export function exportScheduleToCsv(options: CsvExportOptions): void {
    const { filename, events, settings } = options
    const { use12HourFormat } = settings

    try {
        // CSV Header
        const headers = ['Date', 'Day', 'Title', 'Description', 'Start Time', 'End Time', 'Duration', 'Color']

        // Sort events by date and start time
        const sortedEvents = [...events].sort((a, b) => {
            // First sort by date
            const dateCompare = a.date.localeCompare(b.date)
            if (dateCompare !== 0) return dateCompare
            // Then by start time
            const aStart = a.startHour * 60 + a.startMinute
            const bStart = b.startHour * 60 + b.startMinute
            return aStart - bStart
        })

        // Build CSV rows
        const rows: string[] = []

        // Add header row
        rows.push(headers.join(','))

        // Add data rows
        for (const event of sortedEvents) {
            const row = [
                event.date, // Date (YYYY-MM-DD)
                getDayName(event.date), // Day name
                escapeCsvField(event.title), // Title
                escapeCsvField(event.description || ''), // Description
                formatTime(event.startHour, event.startMinute, use12HourFormat), // Start Time
                formatTime(event.endHour, event.endMinute, use12HourFormat), // End Time
                calculateDuration(event.startHour, event.startMinute, event.endHour, event.endMinute), // Duration
                event.color || 'blue' // Color
            ]
            rows.push(row.join(','))
        }

        // Join all rows with newlines
        const csvContent = rows.join('\n')

        // Create Blob and download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }) // BOM for Excel compatibility
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error("CSV export failed:", error)
        throw new Error("Failed to export schedule to CSV")
    }
}
