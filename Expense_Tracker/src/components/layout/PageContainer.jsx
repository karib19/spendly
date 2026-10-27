function PageContainer({
  children,
  sidebarCollapsed = false,
}) {
  return (
    <main
      className={`
        min-h-[calc(100dvh-5rem)]
        min-w-0
        px-4
        pt-6
        pb-24
        transition-[margin] duration-300 ease-in-out
        sm:px-6
        sm:pt-8
        md:px-8
        md:pb-8
        ${
          sidebarCollapsed
            ? "md:ml-20"
            : "md:ml-64"
        }
      `}
    >
      <div className="mx-auto w-full max-w-[1600px] min-w-0">
        {children}
      </div>
    </main>
  );
}

export default PageContainer;
