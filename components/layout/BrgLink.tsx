"use client";

const HASH = "brg";

interface BrgLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

/**
 * BRG 안내 모달을 여는 해시 링크입니다.
 */
export function BrgLink({ children, className, ...rest }: BrgLinkProps) {
  return (
    <a
      href={`#${HASH}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = HASH;
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
