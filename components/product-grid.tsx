import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <p className="empty">Belum ada produk aktif.</p>;
  return (
    <div className="grid-products">
      {products.map((product) => (
        <article className="card product" key={product.id}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
          />
          <div className="product-body">
            <span className="product-sku">{product.sku} · {product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <Link className="button" href="/b2b">Ajukan kemitraan</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
