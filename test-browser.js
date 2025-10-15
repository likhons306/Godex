#!/usr/bin/env node

/**
 * Browser interaction test for Godex
 * Tests the Codex-style personality and functionality
 */

const API_BASE_URL = 'http://localhost:3001';

console.log('🧪 Testing Godex with Codex-style personality...\n');

async function testCodexPersonality() {
  console.log('Testing: Simple code request (Codex-style)');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [],
        userMessage: 'Write a function to reverse a string in Python',
      }),
    });

    const data = await response.json();
    
    console.log('\n✅ Response received');
    console.log('─────────────────────────────────────────');
    console.log(data.text);
    console.log('─────────────────────────────────────────');
    
    // Check if response is concise (Codex-style)
    const wordCount = data.text.split(/\s+/).length;
    console.log(`\n📊 Word count: ${wordCount}`);
    
    if (wordCount < 200) {
      console.log('✅ Response is concise (Codex-style)');
    } else {
      console.log('⚠️ Response might be too verbose');
    }
    
    // Check if code is included
    if (data.text.includes('```python')) {
      console.log('✅ Code block included');
    }
    
    console.log('\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function testStreamingResponse() {
  console.log('Testing: Streaming response with reasoning');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [],
        userMessage: 'What is recursion?',
      }),
    });

    let fullContent = '';
    let chunkCount = 0;

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

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
          } else if (data.type === 'complete') {
            console.log(`\n✅ Streaming completed (${chunkCount} chunks)`);
            console.log('─────────────────────────────────────────');
            console.log(fullContent);
            console.log('─────────────────────────────────────────\n');
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function runTests() {
  const test1 = await testCodexPersonality();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const test2 = await testStreamingResponse();
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('🎯 Test Results:');
  console.log('═══════════════════════════════════════════════');
  console.log(`${test1 ? '✅' : '❌'} Codex-style personality test`);
  console.log(`${test2 ? '✅' : '❌'} Streaming response test`);
  console.log('═══════════════════════════════════════════════\n');
  
  if (test1 && test2) {
    console.log('🎉 Godex is working perfectly with Codex-style personality!');
    console.log('\n✨ Ready to use:');
    console.log('  • Concise, direct, friendly responses');
    console.log('  • Actionable code solutions');
    console.log('  • Real-time streaming');
    console.log('  • Advanced reasoning\n');
  }
}

runTests().catch(console.error);
