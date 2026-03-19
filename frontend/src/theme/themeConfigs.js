export const themeConfigs = {
  normal: {
    appBackground: "bg-[#ffffff] text-[#111827] transition-colors duration-300",
    navbar: "sticky top-0 z-50 w-full border-b border-[#d1d5db] bg-[#f3f4f6]",
    navbarLogo: "text-[#3b82f6] hover:opacity-80 transition-opacity",
    navbarIconHover: "hover:bg-[#e5e7eb] text-[#4b5563] hover:text-[#111827]",
    
    buttonPrimary: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
    buttonOutline: "border border-[#d1d5db] hover:bg-[#f3f4f6] text-[#111827]",
    buttonGhost: "hover:bg-[#f3f4f6] text-[#111827]",
    buttonDestructive: "bg-red-500 text-white hover:bg-red-600",
    buttonFocus: "focus-visible:ring-[#3b82f6] ring-offset-[#ffffff]",
    
    card: "bg-[#f3f4f6] text-[#111827] shadow-sm border border-[#d1d5db] rounded-xl",
    cardHeader: "flex flex-col space-y-1.5 p-6",
    cardTitle: "text-2xl font-semibold leading-none tracking-tight",
    cardContent: "p-6 pt-0",
    cardFooter: "flex items-center p-6 pt-0 bg-[#f3f4f6] border-t border-[#d1d5db] rounded-b-xl",
    
    input: "bg-[#ffffff] border-[#d1d5db] text-[#111827] placeholder:text-[#9ca3af] focus-visible:ring-[#3b82f6] ring-offset-[#ffffff]",
    
    dropdownContainer: "bg-[#f3f4f6] border-[#d1d5db] shadow-md rounded-md",
    dropdownHeader: "text-[#9ca3af] border-[#d1d5db]",
    dropdownItem: "hover:bg-[#e5e7eb] border-[#d1d5db]/30",
    dropdownTextMain: "text-[#111827]",
    dropdownTextSub: "text-[#9ca3af]",
    
    progressBarBase: "bg-[#e5e7eb]",
    progressBarFill: "bg-[#3b82f6]",
    progressBarSuccess: "bg-green-500",
    progressBarError: "bg-red-500",
    
    textMuted: "text-[#9ca3af]",
    textSecondary: "text-[#4b5563]",
    textAccent: "text-[#3b82f6]"
  },
  dark: {
    appBackground: "bg-[#0f172a] text-[#f8fafc] transition-colors duration-300",
    navbar: "sticky top-0 z-50 w-full border-b border-[#334155] bg-[#1e293b]",
    navbarLogo: "text-[#38bdf8] hover:opacity-80 transition-opacity",
    navbarIconHover: "hover:bg-[#334155] text-[#cbd5e1] hover:text-[#f8fafc]",
    
    buttonPrimary: "bg-[#38bdf8] text-[#0f172a] hover:bg-[#0ea5e9]",
    buttonOutline: "border border-[#334155] hover:bg-[#1e293b] text-[#f8fafc]",
    buttonGhost: "hover:bg-[#1e293b] text-[#f8fafc]",
    buttonDestructive: "bg-red-600 text-white hover:bg-red-700",
    buttonFocus: "focus-visible:ring-[#38bdf8] ring-offset-[#0f172a]",
    
    card: "bg-[#1e293b] text-[#f8fafc] shadow-md border border-[#334155] rounded-xl",
    cardHeader: "flex flex-col space-y-1.5 p-6",
    cardTitle: "text-2xl font-semibold leading-none tracking-tight",
    cardContent: "p-6 pt-0",
    cardFooter: "flex items-center p-6 pt-0 bg-[#1e293b] border-t border-[#334155] rounded-b-xl",
    
    input: "bg-[#0f172a] border-[#334155] text-[#f8fafc] placeholder:text-[#64748b] focus-visible:ring-[#38bdf8] ring-offset-[#0f172a]",
    
    dropdownContainer: "bg-[#1e293b] border-[#334155] shadow-lg rounded-md",
    dropdownHeader: "text-[#64748b] border-[#334155]",
    dropdownItem: "hover:bg-[#334155] border-[#334155]/30",
    dropdownTextMain: "text-[#f8fafc]",
    dropdownTextSub: "text-[#64748b]",
    
    progressBarBase: "bg-[#334155]",
    progressBarFill: "bg-[#38bdf8]",
    progressBarSuccess: "bg-green-500",
    progressBarError: "bg-red-500",
    
    textMuted: "text-[#64748b]",
    textSecondary: "text-[#cbd5e1]",
    textAccent: "text-[#38bdf8]"
  },
  vintage: {
    appBackground: "bg-[#fdf6e3] text-[#586e75] transition-colors duration-300",
    navbar: "sticky top-0 z-50 w-full border-b border-[#d3c6a6] bg-[#eee8d5]",
    navbarLogo: "text-[#cb4b16] hover:opacity-80 transition-opacity",
    navbarIconHover: "hover:bg-[#e1dabe] text-[#657b83] hover:text-[#586e75]",
    
    buttonPrimary: "bg-[#cb4b16] text-[#fdf6e3] hover:bg-[#dc322f]",
    buttonOutline: "border border-[#d3c6a6] hover:bg-[#eee8d5] text-[#586e75]",
    buttonGhost: "hover:bg-[#eee8d5] text-[#586e75]",
    buttonDestructive: "bg-red-600 text-[#fdf6e3] hover:bg-red-700",
    buttonFocus: "focus-visible:ring-[#cb4b16] ring-offset-[#fdf6e3]",
    
    card: "bg-[#eee8d5] text-[#586e75] rounded-md shadow-sm border border-[#d3c6a6]",
    cardHeader: "flex flex-col space-y-1.5 p-6",
    cardTitle: "text-2xl font-semibold leading-none tracking-tight",
    cardContent: "p-6 pt-0",
    cardFooter: "flex items-center p-6 pt-0 bg-[#eee8d5] border-t border-[#d3c6a6] rounded-b-md",
    
    input: "bg-[#fdf6e3] border-[#d3c6a6] text-[#586e75] placeholder:text-[#93a1a1] focus-visible:ring-[#cb4b16] ring-offset-[#fdf6e3] rounded-md",
    
    dropdownContainer: "bg-[#eee8d5] border-[#d3c6a6] shadow-sm rounded-md",
    dropdownHeader: "text-[#93a1a1] border-[#d3c6a6]",
    dropdownItem: "hover:bg-[#e1dabe] border-[#d3c6a6]/30",
    dropdownTextMain: "text-[#586e75]",
    dropdownTextSub: "text-[#93a1a1]",
    
    progressBarBase: "bg-[#e1dabe]",
    progressBarFill: "bg-[#cb4b16]",
    progressBarSuccess: "bg-green-600",
    progressBarError: "bg-red-600",
    
    textMuted: "text-[#93a1a1]",
    textSecondary: "text-[#657b83]",
    textAccent: "text-[#cb4b16]"
  },
  glassmorphic: {
    appBackground: "bg-[#f0f4f8] text-[#1e293b] transition-colors duration-300",
    navbar: "sticky top-0 z-50 w-full backdrop-blur-xl bg-white/40 border-b border-white/50",
    navbarLogo: "text-[#8b5cf6] hover:opacity-80 transition-opacity",
    navbarIconHover: "hover:bg-white/50 text-[#475569] hover:text-[#1e293b]",
    
    buttonPrimary: "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-md hover:shadow-lg backdrop-blur-md",
    buttonOutline: "border border-white/50 hover:bg-white/40 text-[#1e293b] backdrop-blur-md",
    buttonGhost: "hover:bg-white/40 text-[#1e293b]",
    buttonDestructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
    buttonFocus: "focus-visible:ring-[#8b5cf6] ring-offset-[#f0f4f8]",
    
    card: "bg-white/70 text-[#1e293b] shadow-xl backdrop-blur-xl border border-white/50 rounded-2xl",
    cardHeader: "flex flex-col space-y-1.5 p-6",
    cardTitle: "text-2xl font-semibold leading-none tracking-tight",
    cardContent: "p-6 pt-0",
    cardFooter: "flex items-center p-6 pt-0 bg-white/20 border-t border-white/50 rounded-b-2xl",
    
    input: "bg-white/50 border-white/50 text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-[#8b5cf6] ring-offset-[#f0f4f8] backdrop-blur-md rounded-xl",
    
    dropdownContainer: "bg-white/70 border-white/50 shadow-xl backdrop-blur-xl rounded-xl",
    dropdownHeader: "text-[#94a3b8] border-white/50",
    dropdownItem: "hover:bg-white/40 border-white/20",
    dropdownTextMain: "text-[#1e293b]",
    dropdownTextSub: "text-[#94a3b8]",
    
    progressBarBase: "bg-white/50",
    progressBarFill: "bg-[#8b5cf6]",
    progressBarSuccess: "bg-green-500",
    progressBarError: "bg-red-500",
    
    textMuted: "text-[#94a3b8]",
    textSecondary: "text-[#475569]",
    textAccent: "text-[#8b5cf6]"
  }
};
