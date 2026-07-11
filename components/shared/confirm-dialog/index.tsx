"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmDialogBaseProps = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  finalFocus?: React.ComponentProps<typeof AlertDialogContent>["finalFocus"];
  pending?: boolean;
  onConfirm: () => void;
};

type ConfirmDialogUncontrolledProps = {
  trigger: React.ReactNode;
  open?: never;
  onOpenChange?: never;
};

type ConfirmDialogControlledProps = {
  trigger?: never;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ConfirmDialogProps = ConfirmDialogBaseProps &
  (ConfirmDialogUncontrolledProps | ConfirmDialogControlledProps);

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    finalFocus,
    pending = false,
    onConfirm,
  } = props;

  return (
    <AlertDialog
      open={"open" in props ? props.open : undefined}
      onOpenChange={"onOpenChange" in props ? props.onOpenChange : undefined}
    >
      {"trigger" in props ? (
        <AlertDialogTrigger>{props.trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent size="sm" finalFocus={finalFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
