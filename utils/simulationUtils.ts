export const isSimulatedEvent = (m: any): boolean => {
    if (!m) return false;
    // Check raw API properties first
    if (m.data) {
        if (m.data.is_simulated === true) return true;
        if (m.data.type === 'simulated') return true;
        if (m.data.sport?.id === 'ESPORTS') return true;
        
        const categoryId = m.data.tournament?.category?.id?.toString().toLowerCase();
        if (categoryId === 'srl' || categoryId === 'cyber') return true;
        
        const categoryName = m.data.tournament?.category?.name?.toLowerCase() || '';
        if (categoryName.includes('srl') || categoryName.includes('simulated')) return true;
    }
    
    // Fallback to normalized properties if raw data isn't enough
    const sName = m.sport?.toLowerCase() || '';
    if (sName === 'e-spor' || sName.includes('esoccer') || sName.includes('esports')) return true;
    
    const lName = m.data?.tournament?.name?.toLowerCase() || '';
    if (lName.includes('srl') || lName.includes('cyber') || lName.includes('esoccer')) return true;
    
    return false;
};
