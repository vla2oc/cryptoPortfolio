
export function percentDifference(a, b){
    return +(((b - a) / Math.abs(a)) * 100).toFixed(2);
}

export function capitalize(str){
    return str.charAt(0).toUpperCase() + str.substr(1)
}

export function calculateTotalHoldingValue(assets){

    return assets.reduce((sum,asset) => {
        const value = parseFloat(asset.totalAmount || 0)
        return sum+value
    },0 )
}
export function calculateTotalProfit(assets){

    return assets.reduce((sum,asset) => {
        const value = parseFloat(asset.totalProfit || 0)
        return sum+value
    },0 )
}
export function calculateTotalInvestments(assets){

    return assets.reduce((sum,asset) => {
        const cost = (asset.price || 0) * (asset.amount || 0)
        return sum+cost
    },0 )
}

export function calculateAveragePrice(assets) {
    
    const { totalCost, totalAmount } = assets.reduce((acc, asset) => {
        
        const cost = asset.amount * asset.price; 
         
        return {
            totalCost: acc.totalCost + cost,
            totalAmount: acc.totalAmount + asset.amount,
        };
        
    }, { totalCost: 0, totalAmount: 0 });
    
    const avgPrice = totalAmount === 0 ? 0 : totalCost/totalAmount
    return{
        avgPrice,
        totalInvested:totalCost,
    }
}