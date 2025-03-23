import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

class AccordionItem extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AccordionPrimitive.Item
        className={cn("border-b", className)}
        {...props}
      />
    );
  }
}
AccordionItem.displayName = "AccordionItem";

class AccordionTrigger extends React.Component {
  render() {
    const { className, children, ...props } = this.props;
    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            className
          )}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

class AccordionContent extends React.Component {
  render() {
    const { className, children, ...props } = this.props;
    return (
      <AccordionPrimitive.Content
        className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
      >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
      </AccordionPrimitive.Content>
    );
  }
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };