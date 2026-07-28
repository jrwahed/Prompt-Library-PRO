import Link from "next/link";
import { BrandMark } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <BrandMark className="h-14 w-14 text-brand-200 dark:text-brand-800" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">الصفحة دي مش موجودة</h1>
        <p className="text-content-muted">
          يمكن البرومبت اتشال أو الكود اتغيّر. ارجع للمكتبة ودوّر من هناك.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        رجوع للمكتبة
      </Link>
    </main>
  );
}
