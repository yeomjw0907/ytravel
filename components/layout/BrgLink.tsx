"use client";

const HASH = "brg";

interface BrgLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

/**
 * BRG 설명 모달을 띄우는 링크. Next.js Link의 hash 전환은 hashchange를 유발하지 않을 수 있어
 * 클릭 시 직접 location.hash를 설정해 BrgModalTrigger가 반응하도록 함.
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
