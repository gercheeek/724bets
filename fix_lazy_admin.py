import re

filename = 'components/AdminPanel.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace the opening fragment with Suspense
old_return = """                        // Eğer yetki varsa veya sayfa herkese açıksa, ilgili tabı render et:
                        return (
                            <>
                                {activeTab === 'dashboard' && ("""
new_return = """                        // Eğer yetki varsa veya sayfa herkese açıksa, ilgili tabı render et:
                        return (
                            <React.Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[500px] w-full"><div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div></div>}>
                                {activeTab === 'dashboard' && ("""

content = content.replace(old_return, new_return)

# Look for the end of the IIFE
old_end = """                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}"""

new_end = """                            </React.Suspense>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}"""

content = content.replace(old_end, new_end)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated lazy loading Suspense wrapper in {filename}")
