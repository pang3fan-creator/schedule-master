import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    // suppressHydrationWarning is needed because Radix UI generates random IDs
    // for accessibility attributes (aria-controls, id) which differ between SSR and client
    <Accordion type="single" collapsible className="w-full" suppressHydrationWarning>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white hover:no-underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-300">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
