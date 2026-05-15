/**
 * IconBookOpen
 *
 * Custom stroke-based open-book icon sourced from Figma (node 2395:6876 /
 * Icon / BookOpen 2051:2389). Accepts the same size / strokeWidth / className
 * interface as Lucide icons so it is a drop-in replacement.
 */
export default function IconBookOpen({
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14.6633 13.33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M7.33167 3.33167C7.33167 2.62442 7.05071 1.94615 6.55062 1.44605C6.05052 0.945951 5.37224 0.665 4.665 0.665H0.665V10.665H5.33167C5.8621 10.665 6.37081 10.8757 6.74588 11.2508C7.12095 11.6259 7.33167 12.1346 7.33167 12.665M7.33167 3.33167V12.665M7.33167 3.33167C7.33167 2.62442 7.61262 1.94615 8.11271 1.44605C8.61281 0.945951 9.29109 0.665 9.99833 0.665H13.9983V10.665H9.33167C8.80123 10.665 8.29253 10.8757 7.91745 11.2508C7.54238 11.6259 7.33167 12.1346 7.33167 12.665"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
