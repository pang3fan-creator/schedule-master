import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PricingCardProps {
    title: string
    price: string
    priceDetail?: string
    description: string
    features: string[]
    buttonText: string
    buttonVariant?: "default" | "outline" | "secondary"
    popular?: boolean
}

export function PricingCard({
    title,
    price,
    priceDetail,
    description,
    features,
    buttonText,
    buttonVariant = "default",
    popular = false,
}: PricingCardProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
                popular ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200"
            )}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={cn("text-lg font-semibold", popular ? "text-blue-600" : "text-gray-900")}>
                    {title}
                </h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-bold tracking-tight">{price}</span>
                    {priceDetail && <span className="ml-1 text-sm text-gray-500">{priceDetail}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                variant={buttonVariant}
                className={cn("w-full mb-2", popular && "bg-blue-600 hover:bg-blue-700")}
            >
                {buttonText}
            </Button>
        </div>
    )
}
