#!/usr/bin/gjs
const Gtk = imports.gi.Gtk;
const Glib = imports.gi.GLib;

Gtk.init(null, 0);

let Builder = new Gtk.Builder();
Builder.add_from_file('gomoney.glade');

let win = Builder.get_object('wBudgetApp'); 
//win.set_default_size(500, 300); // lets try our old hint ))

//let btn = Builder.get_object('okBtn');
//btn.connect('clicked', function(){
//	print('Thanx for click me');
//});

win.connect('destroy', function(){
	Gtk.main_quit();
});

//let store = Builder.get_object('transStore');
//let selection = Builder.get_object('wordsSelection');
//
//selection.connect('changed', function(){
//	let [isSelected, model, iter] = selection.get_selected();
//	print(store.get_value(iter, 0));
//});

win.show_all(); // As in previous we need to show all

// And run
Gtk.main();