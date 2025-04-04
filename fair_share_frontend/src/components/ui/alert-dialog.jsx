import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

class AlertDialogOverlay extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      />
    );
  }
}
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

class AlertDialogContent extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className
          )}
          {...props}
        />
      </AlertDialogPortal>
    );
  }
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

class AlertDialogHeader extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div
        className={cn(
          "flex flex-col space-y-2 text-center sm:text-left",
          className
        )}
        {...props}
      />
    );
  }
}
AlertDialogHeader.displayName = "AlertDialogHeader";

class AlertDialogFooter extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
          className
        )}
        {...props}
      />
    );
  }
}
AlertDialogFooter.displayName = "AlertDialogFooter";

class AlertDialogTitle extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPrimitive.Title
        className={cn("text-lg font-semibold", className)}
        {...props}
      />
    );
  }
}
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

class AlertDialogDescription extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPrimitive.Description
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
}
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

class AlertDialogAction extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants(), className)}
        {...props}
      />
    );
  }
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

class AlertDialogCancel extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <AlertDialogPrimitive.Cancel
        className={cn(
          buttonVariants({ variant: "outline" }),
          "mt-2 sm:mt-0",
          className
        )}
        {...props}
      />
    );
  }
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};