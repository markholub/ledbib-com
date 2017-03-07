/*
This script detects if the frame is at the top level, and if it is, then
it redirects itself out
*/

if (window === window.top) {
	var parts = window.location.href.split('/')
	var name = parts.pop().split('.').shift()
	window.location.href = parts.join('/') + '#' + name
}