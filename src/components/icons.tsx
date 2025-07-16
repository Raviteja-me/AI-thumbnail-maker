import type { SVGProps } from "react";

export function ThumbForgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.4 10.5C7.8 12 8.2 13.2 9.2 14.1C10.2 15 11.5 15.5 13 15.5C14.5 15.5 15.8 15 16.8 14.1C17.8 13.2 18.2 12 18.6 10.5" />
      <path d="M5 20V9C5 5.7 7.7 3 11 3h2c3.3 0 6 2.7 6 6v11" />
      <path d="M12 15.5V20.5" />
      <path d="M12 3V1" />
      <path d="M10 20.5H14" />
      <path d="M7 20H1" />
      <path d="M23 20H17" />
    </svg>
  );
}
