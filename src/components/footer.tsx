export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl font-poppins">
              design<span className="text-primary">YEH</span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} DesignYEH. All rights reserved.</p>
            <p className="mt-1">Creative Director YEH | 010-7582-7271</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

