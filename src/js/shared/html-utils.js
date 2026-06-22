    function escapeAttr(value) {
      return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function escapeHtml(value) {
      return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function jsString(value) {
      return JSON.stringify(String(value || '')).replace(/</g, '\\u003c');
    }

    function domId(value) {
      return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '-');
    }

    function nowStamp() {
      return new Date().toLocaleString('th-TH');
    }
