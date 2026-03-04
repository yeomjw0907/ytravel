import { type ReactNode } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-container-sm",
  md: "max-w-container-md",
  lg: "max-w-container-lg",
  xl: "max-w-container-xl",
};

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

/**
 * 공통 콘텐츠 너비 컨테이너 (디자인 시스템 4.1 기준)
 * - sm: 720px, md: 960px, lg: 1200px, xl: 1320px
 * - 검색 결과·비교 페이지 확장 시 동일 컴포넌트로 일관 적용
 */
export function Container({ children, size = "lg", className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 md:px-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}
