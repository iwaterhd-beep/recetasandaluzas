"use client";

import { ExternalLink, ShoppingBag } from "lucide-react";
import {
  amazonProductUrl,
  hasAmazonTag,
  productsForCategory,
  type AmazonProduct,
} from "@/lib/amazon-affiliates";
import type { Categoria } from "@/types/receta";

interface AmazonAffiliateProps {
  categoria: Categoria;
  limit?: number;
  compact?: boolean;
  className?: string;
}

function ProductCard({
  product,
  compact,
}: {
  product: AmazonProduct;
  compact?: boolean;
}) {
  return (
    <a
      href={amazonProductUrl(product.asin)}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      className={`amazon-card group ${compact ? "amazon-card--compact" : ""}`}
    >
      <span className="amazon-card__icon" aria-hidden>
        <ShoppingBag className="size-4" />
      </span>
      <span className="amazon-card__body">
        <span className="amazon-card__eyebrow">Amazon · Afiliado</span>
        <span className="amazon-card__title">{product.title}</span>
        {!compact && <span className="amazon-card__blurb">{product.blurb}</span>}
      </span>
      <ExternalLink
        className="amazon-card__ext size-3.5 shrink-0 opacity-50 transition group-hover:opacity-100"
        aria-hidden
      />
    </a>
  );
}

export function AmazonAffiliate({
  categoria,
  limit = 2,
  compact = false,
  className = "",
}: AmazonAffiliateProps) {
  const products = productsForCategory(categoria, limit);

  return (
    <div className={`amazon-rail ${className}`} data-affiliate="amazon">
      <div className="amazon-rail__head">
        <p className="amazon-rail__label">Útiles para esta receta</p>
        <p className="amazon-rail__hint">
          {hasAmazonTag()
            ? "Enlaces de afiliado Amazon — sin coste extra para ti"
            : "Sugerencias de utensilios · Amazon"}
        </p>
      </div>
      <div className={`amazon-rail__list ${compact ? "amazon-rail__list--compact" : ""}`}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact={compact} />
        ))}
      </div>
    </div>
  );
}
