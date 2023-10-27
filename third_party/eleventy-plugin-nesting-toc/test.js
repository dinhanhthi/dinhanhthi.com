const assert = require('assert').strict;
const Toc = require('./toc');
const chalk = require('chalk');


const tests = {
    simpleBlankResponse() {
        const toc = new Toc(`<h1 id="foo">Foo</h1>`);
        const results = toc.get();
        assert.equal(results.children.length, 0);
    },

    simpleWithOptions() {
        const toc = new Toc(`<h1 id="foo">Foo</h1>`, {tags: ['h1']});
        const results = toc.get();
        assert.equal(results.children.length, 1);
        assert.equal(results.children[0].slug, 'foo');
        assert.equal(results.children[0].text, 'Foo');
    },

    twoH2s() {
        const toc = new Toc(`
            <h1>Foo</h1>
                <h2 id="bar">Bar</h2>
                <h2 id="baz">Baz</h2>
        `);
        const results = toc.get();
        assert.equal(results.children.length, 2);
        assert.equal(results.children[0].slug, 'bar');
        assert.equal(results.children[0].text, 'Bar');
        assert.equal(results.children[1].slug, 'baz');
        assert.equal(results.children[1].text, 'Baz');
    },

    twoH2sWithOneBeingExcluded() {
        const toc = new Toc(`
            <h1>Page Title</h1>
                <h2 id="section1">Section 1</h2>
                <h2 id="section2" data-toc-exclude>Section 2</h2>
        `);
        const results = toc.get();
        assert.equal(results.children.length, 1);
        assert.equal(results.children[0].slug, 'section1');
        assert.equal(results.children[0].text, 'Section 1');
    },

    twoH2sWithElementsToIgnoreInOne() {
        const toc = new Toc(`
                <h1>Page Title</h1>
                    <h2 id="section1">Section 1</h2>
                    <h2 id="section2">Section 2 <a class="permalink">#</a></h2>
        `, {ignoredElements: ['.permalink']})
        const results = toc.get();
        assert.equal(results.children[1].text, 'Section 2')
    },

    withHeadingTextOptions() {
        const toc = new Toc(`<h2 id="foo">Foo</h2>`, {headingText: 'Sections'});
        const html = toc.html();
        assert.ok(html.includes(`<h2>Sections</h2>`), 'TOC heading of h2 was not found');
    },

    withHeadingTextAndHeadingTagOptions() {
        const toc = new Toc(`<h2 id="foo">Foo</h2>`, {headingText: 'Sections', headingTag: 'h5'});
        const html = toc.html();
        assert.ok(html.includes(`<h5>Sections</h5>`), 'TOC heading of h5 was not found');
    },

    withHeadingOptionsButNoHeadings() {
        const toc = new Toc(`<div>Hello World</div>`, {headingText: 'Sections'});
        const html = toc.html();
        assert.ok(!html.includes(`<h2>Sections</h2>`), 'Unexpected TOC heading of h2 was found');
    },

    nesting() {
        const toc = new Toc(`
            <h1>Foo</h1>
                <h2 id="bar">Bar</h2>
                    <h3 id="foobar">FooBar</h3>
                        <h4 id="deeeep">Deeeep</h4>
                    <h3 id="foobar-again">FooBar Again</h3>
                <h2 id="baz">Baz</h2>
                    <h3 id="bazbar">BazBar</h3>
            <h1>Hello</h1>
        `);
        const results = toc.get();
        assert.equal(results.children.length, 2);
        assert.equal(results.children[0].slug, 'bar');
        assert.equal(results.children[0].text, 'Bar');
        assert.equal(results.children[1].slug, 'baz');
        assert.equal(results.children[1].text, 'Baz');
        assert.equal(results.children[0].children.length, 2);
        assert.equal(results.children[0].children[0].slug, 'foobar');
        assert.equal(results.children[0].children[0].text, 'FooBar');
        assert.equal(results.children[0].children[1].slug, 'foobar-again');
        assert.equal(results.children[0].children[1].text, 'FooBar Again');
        assert.equal(results.children[0].children[0].children.length, 1);
        assert.equal(results.children[0].children[0].children[0].slug, 'deeeep');
        assert.equal(results.children[0].children[0].children[0].text, 'Deeeep');
        assert.equal(results.children[1].children.length, 1);
        assert.equal(results.children[1].children[0].slug, 'bazbar');
        assert.equal(results.children[1].children[0].text, 'BazBar');
    },

    printSomething() {
        const html = `
<h1 id="h1.1">Page Title</h1>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h2 id="h2.1">First Section</h2>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h2 id="h2.2">Second Section</h2>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h3 id="h2.2.1">Subsection 2.1</h3>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h3 id="h2.2.2">Subsection 2.2</h3>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h2 id="h2.3">Third Section</h2>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
<h2 id="h2.4">Fourth Section</h2>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit
</p>
        `
        const toc = new Toc(html);
        // console.log(toc.html());
    }
};

console.log(chalk.blue.bold(`🔬 Starting Tests 🔬`));
for (let name in tests) {
    if (tests.hasOwnProperty(name)) {
        try {
            tests[name].apply();
            console.log('\t↳' + chalk.green.bold(` ✔ ${name}`))
        } catch (e) {
            console.log('\t↳' + chalk.red.bold(` ✘ ${name}`));
            console.error(e);
        }
    }
}
