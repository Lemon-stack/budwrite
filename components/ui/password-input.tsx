"use client";

import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 group w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className="w-full border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-all pl-3 pr-10 py-2 rounded-md"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
