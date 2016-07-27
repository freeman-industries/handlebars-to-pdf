//handlebars-to-pdf
var Handlebars = require('handlebars');
var PDF = require('html-pdf');

module.exports = {
    create: function(options, callback){
        //validate callback
        if(typeof callback !== "function"){
            throw new Error("No callback function supplied.");
            return;
        }

        //check options have been supplied correctly. Required template_html and template_data, optional layout_settings
        if(!options || typeof options !== "object"){
            callback(new Error("`options` is malformatted or doesn't exist."), null);
            return;
        }

        if(!options.template_html || typeof options.template_html !== "string"){
            callback(new Error("`options.template_html` is malformatted or doesn't exist."), null)
            return;
        }

        if(!options.template_data || typeof options.template_data !== "object"){
            callback(new Error("`options.template_data` is malformatted or doesn't exist."), null)
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
