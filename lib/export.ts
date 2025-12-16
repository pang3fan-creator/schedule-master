import html2canvas from "html2canvas"

export type ExportFormat = "png" | "jpg" | "pdf"

interface ExportOptions {
    element: HTMLElement
    filename: string
    format: ExportFormat
    scale?: number // Higher scale = higher resolution
    watermark?: string
}

/**
 * Capture an HTML element as a canvas
 */
export async function captureElement(
    element: HTMLElement,
    scale: number = 2
): Promise<HTMLCanvasElement> {
    const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
    })
    return canvas
}

/**
 * Add watermark to canvas
 */
export function addWatermark(
    canvas: HTMLCanvasElement,
    text: string
): HTMLCanvasElement {
    const ctx = canvas.getContext("2d")
    if (!ctx) return canvas

    ctx.save()
    ctx.font = "14px Arial"
    ctx.fillStyle = "rgba(156, 163, 175, 0.6)" // gray-400 with opacity
    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"

    // Add watermark at bottom right
    const padding = 10
    ctx.fillText(text, canvas.width - padding, canvas.height - padding)

    ctx.restore()
    return canvas
}

/**
 * Download canvas as PNG
 */
export function downloadAsPng(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement("a")
    link.download = `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
}

/**
 * Download canvas as JPG
 */
export function downloadAsJpg(
    canvas: HTMLCanvasElement,
    filename: string,
    quality: number = 0.9
): void {
    const link = document.createElement("a")
    link.download = `${filename}.jpg`
    link.href = canvas.toDataURL("image/jpeg", quality)
    link.click()
}

/**
 * Export schedule to image
 */
export async function exportScheduleToImage(
    options: ExportOptions
): Promise<void> {
    const { element, filename, format, scale = 2, watermark } = options

    try {
        // Capture the element
        let canvas = await captureElement(element, scale)

        // Add watermark if provided
        if (watermark) {
            canvas = addWatermark(canvas, watermark)
        }

        // Download based on format
        if (format === "png") {
            downloadAsPng(canvas, filename)
        } else if (format === "jpg") {
            downloadAsJpg(canvas, filename)
        }
        // PDF export will be handled separately for Pro users
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
    const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD
    return `${prefix}-${dateStr}`
}
