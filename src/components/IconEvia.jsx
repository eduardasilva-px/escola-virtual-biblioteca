/**
 * IconEvia
 *
 * Custom stroke-based EVIA icon sourced from Figma (node 2395:6871).
 * Accepts the same size / strokeWidth / className interface as Lucide icons.
 */
export default function IconEvia({
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14.8333 12.1667"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M7.41667 3.41667V0.75H4.75M0.75 7.41667H2.08333M12.75 7.41667H14.0833M9.41667 6.75V8.08333M5.41667 6.75V8.08333M3.41667 3.41667H11.4167C12.153 3.41667 12.75 4.01362 12.75 4.75V10.0833C12.75 10.8197 12.153 11.4167 11.4167 11.4167H3.41667C2.68029 11.4167 2.08333 10.8197 2.08333 10.0833V4.75C2.08333 4.01362 2.68029 3.41667 3.41667 3.41667Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
