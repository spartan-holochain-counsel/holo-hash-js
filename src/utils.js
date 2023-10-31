
export function set_tostringtag ( cls, name ) {
    Object.defineProperty( cls, "name", {
	value: name || cls.name,
    });
    Object.defineProperty( cls.prototype, Symbol.toStringTag, {
	value: name || cls.name,
	enumerable: false,
    });
}

export function heritage ( target, stop_at = "" ) {
    if ( typeof target !== "function" ) {
	// Empty heritage for primitive types
	if ( target === null || typeof target !== "object" )
	    return [];
	else
	    target			= target.constructor;
    }

    let i				= 0;
    let class_names			= [];
    while ( target.name !== stop_at ) {
	class_names.unshift( target.name );
	target				= Object.getPrototypeOf( target );
	i++;

	if ( i > 50 )
	    throw new Error(`heritage exceeded recursive limit (50); ${class_names.join(", ")}`);
    }

    return class_names;
}

export function in_heritage ( target, class_name ) {
    return heritage( target ).includes( class_name );
}
