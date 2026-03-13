// Tests for Productivity Dashboard Storage Module

/**
 * Simple test runner for browser environment
 */
function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function test(name, fn) {
    try {
      fn();
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
      console.log(`✓ ${name}`);
    } catch (error) {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: error.message });
      console.error(`✗ ${name}: ${error.message}`);
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function assertEquals(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  // Clear storage before tests
  localStorage.clear();

  console.log('\n=== StorageModule Tests ===\n');

  // Test 1: Storage keys are defined
  test('StorageModule.KEYS should contain all required storage keys', () => {
    assert(StorageModule.KEYS.TASKS === 'tasks', 'TASKS key should be "tasks"');
    assert(StorageModule.KEYS.LINKS === 'links', 'LINKS key should be "links"');
    assert(StorageModule.KEYS.POMODORO_CUSTOM_DURATION === 'pomodoroCustomDuration', 'POMODORO_CUSTOM_DURATION key should be "pomodoroCustomDuration"');
    assert(StorageModule.KEYS.THEME === 'theme', 'THEME key should be "theme"');
    assert(StorageModule.KEYS.USER_NAME === 'userName', 'USER_NAME key should be "userName"');
  });

  // Test 2: set and get with string value
  test('set and get should work with string values', () => {
    StorageModule.set('testString', 'hello world');
    const value = StorageModule.get('testString');
    assertEquals(value, 'hello world', 'Should retrieve the same string value');
  });

  // Test 3: set and get with number value
  test('set and get should work with number values', () => {
    StorageModule.set('testNumber', 42);
    const value = StorageModule.get('testNumber');
    assertEquals(value, 42, 'Should retrieve the same number value');
  });

  // Test 4: set and get with object value
  test('set and get should work with object values', () => {
    const testObj = { id: 1, name: 'Test Task', completed: false };
    StorageModule.set('testObject', testObj);
    const value = StorageModule.get('testObject');
    assertEquals(value, testObj, 'Should retrieve the same object value');
  });

  // Test 5: set and get with array value
  test('set and get should work with array values', () => {
    const testArray = [
      { id: 1, text: 'Task 1' },
      { id: 2, text: 'Task 2' }
    ];
    StorageModule.set('testArray', testArray);
    const value = StorageModule.get('testArray');
    assertEquals(value, testArray, 'Should retrieve the same array value');
  });

  // Test 6: get returns null for non-existent key
  test('get should return null for non-existent key', () => {
    const value = StorageModule.get('nonExistentKey');
    assertEquals(value, null, 'Should return null for non-existent key');
  });

  // Test 7: remove should delete a key
  test('remove should delete a key from storage', () => {
    StorageModule.set('testRemove', 'value to remove');
    StorageModule.remove('testRemove');
    const value = StorageModule.get('testRemove');
    assertEquals(value, null, 'Should return null after removal');
  });

  // Test 8: clear should remove all keys
  test('clear should remove all keys from storage', () => {
    StorageModule.set('key1', 'value1');
    StorageModule.set('key2', 'value2');
    StorageModule.set('key3', 'value3');
    StorageModule.clear();
    assertEquals(StorageModule.get('key1'), null, 'key1 should be null after clear');
    assertEquals(StorageModule.get('key2'), null, 'key2 should be null after clear');
    assertEquals(StorageModule.get('key3'), null, 'key3 should be null after clear');
  });

  // Test 9: set and get with boolean value
  test('set and get should work with boolean values', () => {
    StorageModule.set('testBoolean', true);
    const value = StorageModule.get('testBoolean');
    assertEquals(value, true, 'Should retrieve the same boolean value');
  });

  // Test 10: set and get with null value
  test('set and get should work with null value', () => {
    StorageModule.set('testNull', null);
    const value = StorageModule.get('testNull');
    assertEquals(value, null, 'Should retrieve null value');
  });

  // Test 11: Verify storage keys match requirements
  test('Storage keys should match requirements (tasks, links, pomodoroCustomDuration, theme, userName)', () => {
    const keys = StorageModule.KEYS;
    assert(keys.TASKS === 'tasks', 'Should have tasks key');
    assert(keys.LINKS === 'links', 'Should have links key');
    assert(keys.POMODORO_CUSTOM_DURATION === 'pomodoroCustomDuration', 'Should have pomodoroCustomDuration key');
    assert(keys.THEME === 'theme', 'Should have theme key');
    assert(keys.USER_NAME === 'userName', 'Should have userName key');
  });

  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  return results;
}

// Run tests when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    runTests();
  });
} else {
  // For Node.js environment (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests };
  }
}
