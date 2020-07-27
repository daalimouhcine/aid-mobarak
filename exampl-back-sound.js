/* for licence details, see https://gitlab.com/dave.ursa/Zounds */
var Zounds;
(function(e) {
    var d = (function() {
        function f() {
            var g = this;
            this.loading = 0;
            this.loadedCallback = function() {}
            ;
            this.sampleDict = {};
            this.sampleLibrary = {};
            this.dummyZinstance = new c(null,null);
            this.dummyZample = new b("dummy",false,0,function() {
                return g.dummyZinstance
            }
            );
            this.innerContext = new a()
        }
        f.prototype.playURL = function(g) {
            this.load(g, "", true, -1)
        }
        ;
        f.prototype.load = function(m, i, j, h) {
            var g = this;
            if (i === void 0) {
                i = ""
            }
            if (j === void 0) {
                j = false
            }
            if (h === void 0) {
                h = -1
            }
            if (i.length == 0) {
                i = m.split("/").pop().split(".")[0]
            }
            if (this.innerContext.error) {
                this.pushLoading();
                setTimeout(function() {
                    g.popLoading()
                }, 500);
                return this.dummyZample
            }
            var l = this.sampleDict[m];
            if (l !== undefined) {
                if (j) {
                    l.play()
                }
                return l
            }
            this.pushLoading();
            l = new b(m,j,h,function(n) {
                return g.innerContext.playBuffer(n)
            }
            );
            this.sampleDict[m] = l;
            this.sampleLibrary[i] = l;
            var k = new XMLHttpRequest();
            k.open("GET", m, true);
            k.responseType = "arraybuffer";
            k.onload = function(n) {
                if (k.status == 200) {
                    g.innerContext.context.decodeAudioData(k.response, function(o) {
                        l.buffer = o;
                        l.loadComplete = true;
                        if (l.playWhenLoaded) {
                            l.play()
                        }
                        g.popLoading()
                    })
                } else {
                    g.loadedCallback(false, k.statusText + ": " + m);
                    throw new Error(k.statusText + ": " + m)
                }
            }
            ;
            k.onerror = function() {
                throw new Error("Network Error")
            }
            ;
            k.send();
            return l
        }
        ;
        f.prototype.getById = function(g) {
            return this.sampleLibrary[g]
        }
        ;
        f.prototype.playById = function(g) {
            var h = this.getById(g);
            return h.play()
        }
        ;
        f.prototype.getLibrary = function() {
            return this
        }
        ;
        f.prototype.pushLoading = function() {
            this.loading++
        }
        ;
        f.prototype.popLoading = function() {
            this.loading--;
            if (this.loading == 0) {
                this.loadedCallback(true, "");
                this.loadedCallback = function() {}
            }
        }
        ;
        f.prototype.callBackWhenComplete = function(g) {
            this.loadedCallback = g;
            if (this.innerContext.context === undefined) {
                g(false, "Sound not supported.")
            }
            if (this.loading == 0) {
                this.loadedCallback(true, "");
                this.loadedCallback = function() {}
            } else {}
        }
        ;
        f.prototype.getSamplesStillLoading = function() {
            var g = [];
            for (var h in this.sampleDict) {
                if (!this.sampleDict[h].loadComplete) {
                    g[g.length] = h
                }
            }
            return g
        }
        ;
        return f
    }());
    e.Zounds = d;
    var a = (function() {
        function f() {
            this.error = true;
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
                this.error = false
            } catch (g) {
                console.log("No Audio. Exception: " + g)
            }
        }
        f.prototype.playBuffer = function(g) {
            if (this.error) {
                throw new Error("Cannot play the buffer as there is no Audio Context")
            }
            var h = this.context.createBufferSource();
            h.loop = g.loop;
            h.connect(this.context.destination);
            h.buffer = g.buffer;
            h.start();
            return new c(h,g)
        }
        ;
        return f
    }());
    var b = (function() {
        function f(j, i, g, h) {
            this.url = j;
            this.playWhenLoaded = i;
            this.maxPlayFreq = g;
            this.playRaw = h;
            this.loadComplete = false;
            this.loop = false;
            this.lastPlayed = 0
        }
        f.prototype.play = function() {
            if (!this.loadComplete) {
                this.playWhenLoaded = true;
                return null
            }
            if (this.maxPlayFreq > 0) {
                var g = Date.now() - this.lastPlayed;
                if (g < this.maxPlayFreq) {
                    return null
                } else {
                    this.lastPlayed = Date.now()
                }
            }
            return this.playRaw(this)
        }
        ;
        f.prototype.setMaxPlayFrequency = function(g) {
            this.maxPlayFreq = g
        }
        ;
        return f
    }());
    var c = (function() {
        function f(g, h) {
            this.bsNode = g;
            this.zample = h
        }
        f.prototype.stop = function() {
            this.bsNode.stop()
        }
        ;
        return f
    }());
    e.Zinstance = c
}
)(Zounds || (Zounds = {}));
var zounds = new Zounds.Zounds();
