//handlebars-to-pdf
var Check = require('freeman-check');
var Handlebars = require('handlebars');
var PDF = require('html-pdf');

module.exports = {
    create: function(options, callback){
        //check arguments have been supplied correctly. Required template_html and template_data, optional layout_settings
        var check_error = Check.test(options, {
            template_html: "string",
            template_data: "object"
        }, {
            layout_settings: {
                format: "string",
                orientation: "string",
                border: {
                    top: "string",
                    right: "string",
                    bottom: "string",
                    left: "string"
                }
            }
        });

        if(check_error instanceof Check.Error){
            callback(check_error);

            return;
        }

        var output_layout = options.layout_settings || {
            "format": "A4",
            "orientation": "portrait",
            "border": {
                "top": "0.5in",
                "right": "0.5in",
                "bottom": "0.5in",
                "left": "0.5in"
            },
        };

        //compile handlebars template and data into raw HTML
        var output_html = Handlebars.compile(options.template_html)(options.template_data);

        //output final PDF
        PDF.create(
            output_html,
            output_layout
        ).toBuffer(function(error, buffer){
            if(error){
                callback(error);
            } else {
                callback(null, buffer);
            }
        });
    }
}