function MockXHR() {
  MockXHR.requests.push(this)
  this.method = null
  this.url = null
  this.data = null
  this.headers = {}
  this.readyState = 0
  this.status = 0
  this.responseText = null
  this.responseHeaders = ''
}

MockXHR.requests = []
MockXHR.responses = {}

MockXHR.last = function() {
  return MockXHR.requests[MockXHR.requests.length - 1]
}

MockXHR.prototype.open = function(method, url) {
  this.method = method
  this.url = url
}

MockXHR.prototype.getAllResponseHeaders = function() {
  return this.responseHeaders
}

MockXHR.prototype.setRequestHeader = function (name, value) {
  this.headers[name] = value
}

var origin = (function() {
  var link = document.createElement('a')
  link.href = '/'
  return link.href
})()

MockXHR.prototype.send = function(data) {
  this.data = data

  var xhr = this
  setTimeout(function() {
    var path = xhr.url.replace(origin, '/')
    var handle = MockXHR.responses[path]
    if (handle) {
      handle(xhr)
    } else {
      throw 'missing mocked response: ' + path
    }
  }, 100);
}

MockXHR.prototype.respond = function(status, body, headers) {
  this.readyState = 4
  this.status = status
  this.responseText = body
  this.responseHeaders = headers || ''
  var event = {}
  this.onload(event)
}

MockXHR.prototype.abort = function() {
  // Do nothing.
}

MockXHR.prototype.slow = function() {
  var event = {}
  this.ontimeout(event)
}

MockXHR.prototype.error = function() {
  var event = {}
  this.onerror(event)
}
