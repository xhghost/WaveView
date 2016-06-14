var FastBase64 = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],
    Init: function() {
        for (var i = 0; i < 4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },
    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
            dst += this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len -= 3;
            i += 3;
        }
        if (len > 0) {
            var n1 = (src[i] & 0xFC) >> 2;
            var n2 = (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst += this.chars[n1];
            dst += this.chars[n2];
            if (len == 2) {
                var n3 = (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst += this.chars[n3];
            }
            if (len == 1) dst += '=';
            dst += '=';
        }
        return dst;
    }
}
FastBase64.Init();
var RIFFWAVE = function(data, rateParam) {
    this.data = [];
    this.wav = [];
    this.dataURI = '';
    this.header = {
        chunkId: [0x52, 0x49, 0x46, 0x46],
        chunkSize: 0,
        format: [0x57, 0x41, 0x56, 0x45],
        subChunk1Id: [0x66, 0x6d, 0x74, 0x20],
        subChunk1Size: 16,
        audioFormat: 1,
        numChannels: 1,
        sampleRate: rateParam,
        byteRate: 0,
        blockAlign: 0,
        bitsPerSample: 16,
        subChunk2Id: [0x64, 0x61, 0x74, 0x61],
        subChunk2Size: 0
    };
    function u32ToArray(i) {
        return [i & 0xFF, (i >> 8) & 0xFF, (i >> 16) & 0xFF, (i >> 24) & 0xFF];
    }
    function u16ToArray(i) {
        return [i & 0xFF, (i >> 8) & 0xFF];
    }
    this.Make = function(data) {
        if (data instanceof Array) this.data = data;
        this.header.byteRate = (this.header.sampleRate * this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.subChunk2Size = this.data.length;
        this.header.chunkSize = 36 + this.header.subChunk2Size;
        this.wav = this.header.chunkId.concat(u32ToArray(this.header.chunkSize), this.header.format, this.header.subChunk1Id, u32ToArray(this.header.subChunk1Size), u16ToArray(this.header.audioFormat), u16ToArray(this.header.numChannels), u32ToArray(this.header.sampleRate), u32ToArray(this.header.byteRate), u16ToArray(this.header.blockAlign), u16ToArray(this.header.bitsPerSample), this.header.subChunk2Id, u32ToArray(this.header.subChunk2Size), this.data);
        this.dataURI = 'data:audio/wav;base64,' + FastBase64.Encode(this.wav);
    };
    if (data instanceof Array) this.Make(data);
};