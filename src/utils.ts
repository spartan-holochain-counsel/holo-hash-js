
export function set_tostringtag ( cls, name? ) {
    Object.defineProperty( cls, "name", {
	value: name || cls.name,
    });
    Object.defineProperty( cls.prototype, Symbol.toStringTag, {
	value: name || cls.name,
	enumerable: false,
    });
}

export function heritage ( input: any, stop_at = "" ) : Array<string> {
    let target : Function;

    if ( typeof input !== "function" ) {
	// Empty heritage for primitive types
	if ( input === null || typeof input !== "object" )
	    return [];
	else
	    target			= input.constructor;
    }
    else
	target				= input;

    let i				= 0;
    let class_names : Array<string>	= [];
    while ( target.name !== stop_at ) {
	class_names.unshift( target.name );
	target				= Object.getPrototypeOf( target );
	i++;

	if ( i > 50 )
	    throw new Error(`heritage exceeded recursive limit (50); ${class_names.join(", ")}`);
    }

    return class_names;
}

export function in_heritage ( target: any, class_name: string ) {
    return heritage( target ).includes( class_name );
}
