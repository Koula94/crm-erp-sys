// Frontend Integration Test for KADIMAR ERP Backend
// Copy this code to your browser console or create a test page

const API_BASE_URL = 'http://localhost:8080/api';

// Test functions
async function testBackendHealth() {
    console.log('🔍 Testing backend health...');
    try {
        const response = await fetch(`${API_BASE_URL}/test/health`);
        const data = await response.json();
        console.log('✅ Health check passed:', data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error);
        return false;
    }
}

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...');
    try {
        const response = await fetch(`${API_BASE_URL}/test/database`);
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Database connection successful:', data);
        } else {
            console.log('⚠️ Database connection issue:', data);
        }
        return response.ok;
    } catch (error) {
        console.error('❌ Database test failed:', error);
        return false;
    }
}

async function testCorsConfiguration() {
    console.log('🔍 Testing CORS configuration...');
    try {
        const response = await fetch(`${API_BASE_URL}/test/cors`);
        const data = await response.json();
        console.log('✅ CORS test passed:', data);
        return true;
    } catch (error) {
        console.error('❌ CORS test failed:', error);
        return false;
    }
}

async function testCreateContact() {
    console.log('🔍 Testing contact creation...');
    const testContact = {
        name: 'Test User',
        email: `test.user.${Date.now()}@example.com`,
        phone: '+1234567890',
        company: 'Test Company',
        position: 'Test Position',
        category: 'CLIENT',
        status: 'ACTIVE',
        notes: 'This is a test contact created by integration test'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testContact)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Contact created successfully:', data);
            return data;
        } else {
            console.error('❌ Contact creation failed:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Contact creation error:', error);
        return null;
    }
}

async function testGetContacts() {
    console.log('🔍 Testing get all contacts...');
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`);
        const data = await response.json();
        console.log('✅ Contacts retrieved:', data);
        return data;
    } catch (error) {
        console.error('❌ Get contacts failed:', error);
        return null;
    }
}

async function testCreateCommunication(contactId) {
    if (!contactId) {
        console.log('⚠️ Skipping communication test - no contact ID provided');
        return null;
    }
    
    console.log('🔍 Testing communication creation...');
    const testCommunication = {
        type: 'EMAIL',
        subject: 'Test Communication',
        content: 'This is a test communication created by integration test',
        communicationDate: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/communications/contact/${contactId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testCommunication)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Communication created successfully:', data);
            return data;
        } else {
            console.error('❌ Communication creation failed:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Communication creation error:', error);
        return null;
    }
}

async function testContactStats() {
    console.log('🔍 Testing contact statistics...');
    try {
        const response = await fetch(`${API_BASE_URL}/contacts/stats`);
        const data = await response.json();
        console.log('✅ Contact stats retrieved:', data);
        return data;
    } catch (error) {
        console.error('❌ Contact stats failed:', error);
        return null;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting KADIMAR ERP Backend Integration Tests...');
    console.log('=' .repeat(50));
    
    const results = {
        health: false,
        database: false,
        cors: false,
        createContact: false,
        getContacts: false,
        createCommunication: false,
        stats: false
    };
    
    // Test 1: Health check
    results.health = await testBackendHealth();
    
    // Test 2: Database connection
    results.database = await testDatabaseConnection();
    
    // Test 3: CORS configuration
    results.cors = await testCorsConfiguration();
    
    // Test 4: Create contact
    const createdContact = await testCreateContact();
    results.createContact = createdContact !== null;
    
    // Test 5: Get contacts
    const contacts = await testGetContacts();
    results.getContacts = contacts !== null;
    
    // Test 6: Create communication (if contact was created)
    if (createdContact && createdContact.id) {
        const communication = await testCreateCommunication(createdContact.id);
        results.createCommunication = communication !== null;
    }
    
    // Test 7: Get statistics
    const stats = await testContactStats();
    results.stats = stats !== null;
    
    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Test Results Summary:');
    console.log('=' .repeat(50));
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`${test.padEnd(20)}: ${status}`);
    });
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log('\n' + '=' .repeat(50));
    console.log(`🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Backend is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the logs above for details.');
    }
    
    return results;
}

// Instructions
console.log('KADIMAR ERP Backend Integration Test');
console.log('=====================================');
console.log('To run all tests, execute: runAllTests()');
console.log('To run individual tests, use:');
console.log('- testBackendHealth()');
console.log('- testDatabaseConnection()');
console.log('- testCorsConfiguration()');
console.log('- testCreateContact()');
console.log('- testGetContacts()');
console.log('- testContactStats()');
console.log('\nMake sure the backend server is running on http://localhost:8080');

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testBackendHealth,
        testDatabaseConnection,
        testCorsConfiguration,
        testCreateContact,
        testGetContacts,
        testCreateCommunication,
        testContactStats
    };
}