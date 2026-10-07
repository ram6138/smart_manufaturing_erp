async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('Testing ERP Form Submissions & API POST Endpoints...');

  const results = [];

  // 1. Orders: Create Order
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createOrder',
        customerName: 'Global Foods Corp',
        productId: 1,
        quantity: 500,
        unitPrice: 4.5,
        priority: 'High',
      }),
    });
    const data = await res.json();
    results.push({ name: 'Orders - Create Sales Order', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Orders - Create Sales Order', status: 'ERR', message: err.message });
  }

  // 2. Production: Create Work Order
  try {
    const res = await fetch(`${baseUrl}/api/production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createOrder',
        productId: 1,
        machineId: 1,
        shiftId: 1,
        plannedQuantity: 6000,
        plannedHours: 8.0,
        batchNumber: `BAT-TEST-${Date.now().toString().slice(-4)}`,
      }),
    });
    const data = await res.json();
    results.push({ name: 'Production - Create Work Order', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Production - Create Work Order', status: 'ERR', message: err.message });
  }

  // 3. Machines: Schedule Maintenance
  try {
    const res = await fetch(`${baseUrl}/api/machines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'scheduleMaintenance',
        machineId: 1,
        maintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceAction: 'Greasing and conveyor belt calibration',
        shiftId: 1,
      }),
    });
    const data = await res.json();
    results.push({ name: 'Machines - Schedule Maintenance', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Machines - Schedule Maintenance', status: 'ERR', message: err.message });
  }

  // 4. Inventory: Add Item
  try {
    const res = await fetch(`${baseUrl}/api/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addItem',
        productName: `Vanilla Extract Formulation ${Date.now().toString().slice(-4)}`,
        productCode: `RAW-${Date.now().toString().slice(-4)}`,
        categoryId: 1,
        quantity: 1200,
        unitPrice: 15.0,
      }),
    });
    const data = await res.json();
    results.push({ name: 'Inventory - Add Item', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Inventory - Add Item', status: 'ERR', error: err.message });
  }

  // 5. Procurement: Create PO
  try {
    const res = await fetch(`${baseUrl}/api/procurement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createPO',
        supplierId: 1,
        productId: 1,
        quantity: 2500,
        unitPrice: 2.2,
      }),
    });
    const data = await res.json();
    results.push({ name: 'Procurement - Create Purchase Order', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Procurement - Create Purchase Order', status: 'ERR', message: err.message });
  }

  // 6. Quality: New Inspection
  try {
    const res = await fetch(`${baseUrl}/api/quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createInspection',
        productionOrderId: 1,
        batchNumber: 'BAT-2026-001',
        inspectedQuantity: 500,
        passedQuantity: 495,
        defectiveQuantity: 5,
        defectFound: true,
        defectType: 'Minor Sizing Variation',
        defectCount: 5,
        defectSeverity: 'Low',
        qualityStatus: 'Passed with Notes',
      }),
    });
    const data = await res.json();
    results.push({ name: 'Quality - Create Inspection', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Quality - Create Inspection', status: 'ERR', message: err.message });
  }

  // 7. Workforce: Add Employee
  try {
    const res = await fetch(`${baseUrl}/api/workforce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addEmployee',
        employeeName: 'Sarah Jenkins',
        employeeCode: `EMP-T${Date.now().toString().slice(-3)}`,
        departmentId: 1,
        jobRole: 'Packaging Lead',
        primarySkill: 'High-speed Flow Wrapper',
      }),
    });
    const data = await res.json();
    results.push({ name: 'Workforce - Add Employee', status: res.status, success: data.status === 'success', message: data.message });
  } catch (err) {
    results.push({ name: 'Workforce - Add Employee', status: 'ERR', message: err.message });
  }

  console.log('\n--- FORM SUBMISSION & API POST TEST RESULTS ---');
  console.table(results);

  const allPassed = results.every(r => r.status === 200 && r.success === true);
  console.log(`\nOverall Status: ${allPassed ? 'ALL FORM SUBMISSIONS & POSTS WORKING PERFECTLY' : 'SOME TESTS FAILED'}`);
}

runTests();
