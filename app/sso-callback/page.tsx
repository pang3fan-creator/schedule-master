import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeClerkProvider } from "@/components/ThemeClerkProvider";

export default function SSOCallback() {
  return (
    <ThemeProvider>
      <ThemeClerkProvider locale="en">
        <AuthenticateWithRedirectCallback />
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
