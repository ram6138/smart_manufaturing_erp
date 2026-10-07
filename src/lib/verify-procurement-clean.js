async function main() {
  const res = await fetch('http://localhost:3000/api/procurement');
  const d = await res.json();
  console.log('Purchase Orders in Procurement API:');
  d.purchaseOrders.forEach(po => {
    const itemsStr = po.items.map(i => `${i.material} (${i.quantity} ${i.unit})`).join(', ');
    console.log(`${po.poNumber} | ${po.supplierName} | ₹${po.totalAmount.toLocaleString()} | ${itemsStr}`);
  });
}
main();
