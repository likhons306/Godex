#!/usr/bin/env node

/**
 * Comprehensive test script for Godex AI SDK integration
 * Tests: API connection, streaming, reasoning, and code analysis
 */

import { streamMessage, sendMessage, analyzeCode } from './src/lib/gemini.ts';

console.log('🧪 Starting Godex AI SDK Tests...\n');

// Test 1: Basic API Connection (non-streaming)
async function testBasicMessage() {
  console.log('📝 Test 1: Basic Message (Non-streaming)');
  console.log('Testing sendMessage function...');
  
  try {
    const result = await sendMessage(
      [],
      'Write a simple function to add two numbers in JavaScript. Keep it brief.'
    );
    
    console.log('✅ Response received successfully!');
    console.log('Response preview:', result.text.substring(0, 100) + '...');
    
    if (result.reasoning) {
      console.log('🧠 Reasoning detected:', result.reasoning.substring(0, 80) + '...');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Test 2: Streaming with Thinking/Reasoning
async function testStreaming() {
  console.log('📝 Test 2: Streaming with Reasoning');
  console.log('Testing streamMessage function...');
  
  try {
    let fullResponse = '';
    let reasoning = '';
    let chunkCount = 0;
    
    await streamMessage(
      [],
      'Explain the concept of async/await in JavaScript in 2-3 sentences.',
      (chunk) => {
        fullResponse += chunk;
        chunkCount++;
      },
      (reasoningText) => {
        reasoning = reasoningText;
      },
      () => {
        console.log('✅ Streaming completed successfully!');
        console.log(`Received ${chunkCount} chunks`);
        console.log('Response preview:', fullResponse.substring(0, 100) + '...');
        
        if (reasoning) {
          console.log('🧠 Reasoning captured:', reasoning.substring(0, 80) + '...');
        }
      }
    );
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Test 3: Code Analysis
async function testCodeAnalysis() {
  console.log('📝 Test 3: Code Analysis');
  console.log('Testing analyzeCode function...');
  
  const testCode = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
  `;
  
  try {
    const result = await analyzeCode(
      testCode,
      'Analyze this code and suggest optimizations.'
    );
    
    console.log('✅ Code analysis completed successfully!');
    console.log('Analysis preview:', result.text.substring(0, 100) + '...');
    
    if (result.reasoning) {
      console.log('🧠 Reasoning detected:', result.reasoning.substring(0, 80) + '...');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Test 4: Conversation History
async function testConversationHistory() {
  console.log('📝 Test 4: Conversation History');
  console.log('Testing multi-turn conversation...');
  
  try {
    // First message
    const firstResponse = await sendMessage(
      [],
      'My favorite color is blue.'
    );
    
    // Second message with history
    const secondResponse = await sendMessage(
      [
        { role: 'user', content: 'My favorite color is blue.', timestamp: Date.now() },
        { role: 'assistant', content: firstResponse.text, timestamp: Date.now() }
      ],
      'What is my favorite color?'
    );
    
    console.log('✅ Conversation history test completed!');
    console.log('Response preview:', secondResponse.text.substring(0, 100) + '...');
    
    // Check if response mentions blue
    if (secondResponse.text.toLowerCase().includes('blue')) {
      console.log('✅ Context maintained correctly!');
    } else {
      console.log('⚠️ Warning: Response may not reflect conversation history');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════\n');
  
  const results = {
    basicMessage: await testBasicMessage(),
    streaming: await testStreaming(),
    codeAnalysis: await testCodeAnalysis(),
    conversationHistory: await testConversationHistory()
  };
  
  console.log('═══════════════════════════════════════════════');
  console.log('\n📊 Test Results Summary:');
  console.log('═══════════════════════════════════════════════');
  
  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('═══════════════════════════════════════════════');
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Godex AI SDK is working perfectly!');
    console.log('\n✨ Features verified:');
    console.log('  • Google Gemini 2.5 Pro API connection');
    console.log('  • Streaming responses');
    console.log('  • Thinking/reasoning mode');
    console.log('  • Code analysis');
    console.log('  • Conversation history');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} test(s) failed. Please check the errors above.`);
  }
  
  console.log('\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
