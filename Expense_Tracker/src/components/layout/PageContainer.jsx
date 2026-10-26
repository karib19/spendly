function PageContainer({
  children,
  sidebarCollapsed = false,
}) {
  return (
    <main
      className={`
        min-h-[calc(100vh-5rem)]
        px-4
        py-6
        pb-24
        transition-all
        duration-300
        ease-in-out
        sm:px-6
        sm:py-8
        md:min-h-[calc(100vh-5rem)]
        md:px-8
        md:pb-8
        ${
          sidebarCollapsed
            ? "md:ml-20"
            : "md:ml-64"
        }
      `}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {children}
      </div>
    </main>
  );
}

export default PageContainer;