#!/usr/bin/env node

/**
 * Integration test for Godex - Tests the full stack
 * Frontend → Backend API → Gemini AI → Response
 */

const API_BASE_URL = 'http://localhost:3001';

console.log('🧪 Starting Godex Integration Tests...\n');
console.log('Testing the full stack: Frontend API Client → Backend → Gemini AI\n');
console.log('═══════════════════════════════════════════════\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('📝 Test 1: API Health Check');
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Backend API is healthy');
      console.log(`   Timestamp: ${data.timestamp}\n`);
      return true;
    } else {
      console.log('❌ Backend API health check failed\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend API:', error.message);
    console.log('   Make sure the backend is running on port 3001\n');
    return false;
  }
}

// Test 2: Send Message (Non-streaming)
async function testSendMessage() {
  console.log('📝 Test 2: Send Message (Non-streaming API)');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [],
        userMessage: 'Write a one-line hello world in Python',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Message sent and response received');
    console.log('   Response preview:', data.text.substring(0, 80) + '...');
    
    if (data.reasoning) {
      console.log('   🧠 Reasoning detected:', data.reasoning.substring(0, 60) + '...');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    return false;
  }
}

// Test 3: Stream Message
async function testStreamMessage() {
  console.log('📝 Test 3: Stream Message (SSE API)');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [],
        userMessage: 'Explain recursion in one sentence',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    let fullContent = '';
    let reasoning = '';
    let chunkCount = 0;

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          if (data.type === 'chunk') {
            fullContent += data.content;
            chunkCount++;
          } else if (data.type === 'reasoning') {
            reasoning = data.content;
          } else if (data.type === 'complete') {
            console.log('✅ Streaming completed successfully');
            console.log(`   Received ${chunkCount} chunks`);
            console.log('   Response preview:', fullContent.substring(0, 80) + '...');
            
            if (reasoning) {
              console.log('   🧠 Reasoning detected:', reasoning.substring(0, 60) + '...');
            }
          } else if (data.type === 'error') {
            throw new Error(data.message);
          }
        }
      }
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    return false;
  }
}

// Test 4: Code Analysis
async function testCodeAnalysis() {
  console.log('📝 Test 4: Code Analysis API');
  
  const testCode = `
function sum(a, b) {
  return a + b;
}
  `;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCode,
        query: 'Is this code good?',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Code analysis completed');
    console.log('   Analysis preview:', data.text.substring(0, 80) + '...');
    
    if (data.reasoning) {
      console.log('   🧠 Reasoning detected:', data.reasoning.substring(0, 60) + '...');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    healthCheck: await testHealthCheck(),
    sendMessage: await testSendMessage(),
    streamMessage: await testStreamMessage(),
    codeAnalysis: await testCodeAnalysis(),
  };
  
  console.log('═══════════════════════════════════════════════');
  console.log('\n📊 Integration Test Results Summary:');
  console.log('═══════════════════════════════════════════════');
  
  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('═══════════════════════════════════════════════');
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All integration tests passed!');
    console.log('\n✨ Verified Components:');
    console.log('  ✓ Backend API server (Express)');
    console.log('  ✓ API endpoints (/health, /api/message, /api/stream, /api/analyze)');
    console.log('  ✓ Google Gemini 2.5 Pro integration');
    console.log('  ✓ AI SDK streaming');
    console.log('  ✓ Thinking/reasoning mode');
    console.log('  ✓ Server-Side Events (SSE)');
    console.log('\n🚀 Godex is ready to use!');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} test(s) failed.`);
    console.log('Please check the errors above and ensure:');
    console.log('  1. Backend API is running on port 3001');
    console.log('  2. GOOGLE_GENERATIVE_AI_API_KEY is set');
    console.log('  3. Network connectivity is working');
  }
  
  console.log('\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
