"use client";
import { useUrlState } from "@/hooks/use-url-state";
import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import SignIn from "@/app/(auth-pages)/signin/page";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const { getUrlState, removeUrlState } = useUrlState();
  const action = getUrlState();

  return (
    <>
      {children}
      <Dialog
        open={action.signin}
        onOpenChange={(open) => {
          if (!open) {
            removeUrlState("signin");
          }
        }}
      >
        <DialogContent>
          <SignIn />
        </DialogContent>
      </Dialog>
    </>
  );
}
