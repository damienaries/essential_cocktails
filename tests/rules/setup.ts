import { setLogLevel } from 'firebase/firestore'

// Rules tests deliberately trigger PERMISSION_DENIED to assert denies. The SDK
// logs each one to stderr, which clutters the test output. Silence it.
setLogLevel('silent')
