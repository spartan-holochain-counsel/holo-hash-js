
function set_tostringtag ( cls ) {
    Object.defineProperty(cls.prototype, Symbol.toStringTag, {
	value: cls.name,
	enumerable: false,
    });
}

module.exports = {
    set_tostringtag,
};
