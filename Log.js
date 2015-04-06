    var Logger = require('pretty-logger');
   Logger.setLevel('debug');
    var customConfig = {
        showMillis: false,
        showTimestamp: true,
        info: "gray",
        error: ["bgRed", "bold"],
        debug: "rainbow"
    };

    var log = new Logger(customConfig);

    log.error("An error occurred");
    log.info("Something just happened, thought you should know!"); 
    log.debug("The value of x is: 1"); 
    log.trace("Heres some more stuff to help out."); 
