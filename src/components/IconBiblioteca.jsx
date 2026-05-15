/**
 * IconBiblioteca
 *
 * Custom filled "open book" icon sourced from Figma (node 2409:7487).
 * Accepts the same size / className interface as Lucide icons so it can
 * be used as a drop-in replacement inside SidebarItem.
 */
export default function IconBiblioteca({ size = 16, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14.833 13.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4.75 0C5.54352 5.5293e-08 6.30873 0.276402 6.91699 0.775391V9.7959C6.91726 10.0467 7.14101 10.25 7.41699 10.25C7.69297 10.25 7.91673 10.0467 7.91699 9.7959V0.774414C8.52504 0.276046 9.2901 0.00015079 10.083 0H14.083C14.4972 0 14.833 0.335786 14.833 0.75V10.75C14.833 11.1642 14.4972 11.5 14.083 11.5H9.41699C9.08567 11.5001 8.76753 11.632 8.5332 11.8662C8.29888 12.1006 8.16699 12.4186 8.16699 12.75L8.16309 12.8271C8.12448 13.205 7.80501 13.4998 7.41699 13.5C7.02898 13.4998 6.70952 13.205 6.6709 12.8271L6.66699 12.75L6.66016 12.626C6.63165 12.3401 6.50567 12.0712 6.30078 11.8662C6.06645 11.632 5.74832 11.5001 5.41699 11.5H0.75C0.335936 11.4998 0 11.1641 0 10.75V0.75C0 0.335895 0.335936 0.000175859 0.75 0H4.75Z"
        fill="currentColor"
      />
    </svg>
  )
}
