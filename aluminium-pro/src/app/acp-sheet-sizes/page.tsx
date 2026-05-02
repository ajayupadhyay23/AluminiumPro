import { Metadata } from 'next';
import { Download, ChevronRight, Check, Maximize, Ruler } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ACP Sheet Sizes | Areca & Skybond | AluminiumPro',
  description: 'Buy Areca and Skybond ACP sheets in standard sizes 1220x2440, 1220x3050, 1220x3660mm. Thickness 2mm to 6mm. Interior, exterior and digital panels available.',
  keywords: 'ACP sheet size, aluminium composite panel, Areca ACP, Skybond ACP, ACP sheet India',
};

const arecaColors = [
  { name: 'Glossy White', hex: '#FFFFFF' },
  { name: 'Metallic Silver', hex: '#C0C0C0' },
  { name: 'Glossy Black', hex: '#000000' },
  { name: 'Wooden Oak', hex: '#A0522D' },
  { name: 'Wooden Walnut', hex: '#5C4033' },
  { name: 'Marble White', hex: '#F5F5F6' },
  { name: 'Marble Beige', hex: '#F5F5DC' },
  { name: 'Galaxy Green', hex: '#004B23' },
  { name: 'Galaxy Purple', hex: '#4A0E4E' },
  { name: 'Galaxy Blue', hex: '#000080' },
  { name: 'Rustic Gold', hex: '#B8860B' },
  { name: 'Solid Red', hex: '#C41E3A' },
];

const skybondColors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Brushed', hex: '#B0C4DE' },
];

export default function ACPSheetSizesPage() {
  return (
    <div className="min-h-screen bg-lightbg pb-16">
      {/* Header Section */}
      <div className="bg-charcoal text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            ACP Sheet Sizes — Areca & Skybond
          </h1>
          <p className="text-silver text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Standard aluminium composite panel sizes for interior, exterior, signage and cladding applications.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-12 space-y-16">
        
        {/* Areca ACP Section (Blue Theme) */}
        <section className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
            <h2 className="text-3xl font-bold font-heading">Areca ACP Sheets</h2>
            <p className="text-blue-100 mt-2">Premium quality panels with versatile size and finish options.</p>
          </div>
          
          <div className="p-8">
            <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
              <Ruler className="text-blue-600 w-5 h-5" />
              Standard Sizes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Size 1 */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:border-blue-300 transition-colors">
                <div className="aspect-[4/8] bg-blue-100 rounded-lg border-2 border-blue-400 mb-4 flex items-center justify-center relative mx-auto w-32">
                  <span className="absolute -left-10 text-xs font-semibold text-gray-500 rotate-[-90deg]">2440 mm</span>
                  <span className="absolute -top-6 text-xs font-semibold text-gray-500">1220 mm</span>
                  <span className="text-blue-800 font-bold text-sm">4×8 ft</span>
                </div>
                <h4 className="text-lg font-bold text-center text-charcoal">1220 × 2440 mm</h4>
                <p className="text-sm text-center text-gray-500 font-medium mt-1">Most common</p>
              </div>

              {/* Size 2 */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:border-blue-300 transition-colors">
                <div className="aspect-[4/10] bg-blue-100 rounded-lg border-2 border-blue-400 mb-4 flex items-center justify-center relative mx-auto w-28">
                  <span className="absolute -left-10 text-xs font-semibold text-gray-500 rotate-[-90deg]">3050 mm</span>
                  <span className="absolute -top-6 text-xs font-semibold text-gray-500">1220 mm</span>
                  <span className="text-blue-800 font-bold text-sm">4×10 ft</span>
                </div>
                <h4 className="text-lg font-bold text-center text-charcoal">1220 × 3050 mm</h4>
                <p className="text-sm text-center text-gray-500 font-medium mt-1">Exterior / Facade</p>
              </div>

              {/* Size 3 */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:border-blue-300 transition-colors">
                <div className="aspect-[4/12] bg-blue-100 rounded-lg border-2 border-blue-400 mb-4 flex items-center justify-center relative mx-auto w-24">
                  <span className="absolute -left-10 text-xs font-semibold text-gray-500 rotate-[-90deg]">3660 mm</span>
                  <span className="absolute -top-6 text-xs font-semibold text-gray-500">1220 mm</span>
                  <span className="text-blue-800 font-bold text-sm">4×12 ft</span>
                </div>
                <h4 className="text-lg font-bold text-center text-charcoal">1220 × 3660 mm</h4>
                <p className="text-sm text-center text-gray-500 font-medium mt-1">Cladding / Curtain Wall</p>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-100 pt-8">
              <h3 className="text-lg font-bold text-charcoal mb-4">Thickness Options</h3>
              <div className="flex flex-wrap gap-3">
                {['2mm', '3mm', '4mm', '5mm', '6mm'].map((thick) => (
                  <span key={thick} className="px-4 py-2 bg-blue-50 text-blue-800 font-semibold rounded-lg border border-blue-100">
                    {thick}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-bold text-charcoal mb-4">Available Colours & Finishes</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {arecaColors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center group">
                    <div 
                      className="w-12 h-12 rounded-full border border-gray-200 shadow-sm mb-2 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs text-center text-gray-600 font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skybond ACP Section (Green Theme) */}
        <section className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 text-white">
            <h2 className="text-3xl font-bold font-heading">Skybond ACP Sheets</h2>
            <p className="text-emerald-100 mt-2">Durable and reliable panels for everyday applications.</p>
          </div>
          
          <div className="p-8">
            <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
              <Ruler className="text-emerald-600 w-5 h-5" />
              Standard Sizes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
              {/* Size 1 */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:border-emerald-300 transition-colors">
                <div className="aspect-[4/8] bg-emerald-100 rounded-lg border-2 border-emerald-400 mb-4 flex items-center justify-center relative mx-auto w-32">
                  <span className="absolute -left-10 text-xs font-semibold text-gray-500 rotate-[-90deg]">2440 mm</span>
                  <span className="absolute -top-6 text-xs font-semibold text-gray-500">1220 mm</span>
                  <span className="text-emerald-800 font-bold text-sm">4×8 ft</span>
                </div>
                <h4 className="text-lg font-bold text-center text-charcoal">1220 × 2440 mm</h4>
                <p className="text-sm text-center text-gray-500 font-medium mt-1">3mm & 6mm thick</p>
              </div>

              {/* Size 2 */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:border-emerald-300 transition-colors">
                <div className="aspect-[4/8] bg-emerald-100 rounded-lg border-2 border-emerald-400 mb-4 flex items-center justify-center relative mx-auto w-32">
                  <span className="absolute -left-10 text-xs font-semibold text-gray-500 rotate-[-90deg]">2500 mm</span>
                  <span className="absolute -top-6 text-xs font-semibold text-gray-500">1250 mm</span>
                  <span className="text-emerald-800 font-bold text-sm">Large</span>
                </div>
                <h4 className="text-lg font-bold text-center text-charcoal">1250 × 2500 mm</h4>
                <p className="text-sm text-center text-gray-500 font-medium mt-1">3mm thick</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-bold text-charcoal mb-4">Available Colours</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {skybondColors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center group">
                    <div 
                      className="w-10 h-10 rounded-full border border-gray-200 shadow-sm mb-2 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs text-center text-gray-600 font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference Table & Download */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold font-heading text-charcoal">Quick Reference</h2>
            <a 
              href="/ACP_Sheet_Catalogue_Areca_Skybond.pdf" 
              className="inline-flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              Download PDF Catalogue
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-4 px-4 font-semibold text-charcoal">Brand</th>
                  <th className="py-4 px-4 font-semibold text-charcoal">Width</th>
                  <th className="py-4 px-4 font-semibold text-charcoal">Length</th>
                  <th className="py-4 px-4 font-semibold text-charcoal">Thickness</th>
                  <th className="py-4 px-4 font-semibold text-charcoal">Grade</th>
                  <th className="py-4 px-4 font-semibold text-charcoal text-center">Custom Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-800">Areca S1</td>
                  <td className="py-4 px-4">1220 mm</td>
                  <td className="py-4 px-4">2440 mm</td>
                  <td className="py-4 px-4">2, 3, 4, 5, 6 mm</td>
                  <td className="py-4 px-4">Premium</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-800">Areca S2</td>
                  <td className="py-4 px-4">1220 mm</td>
                  <td className="py-4 px-4">3050 mm</td>
                  <td className="py-4 px-4">2, 3, 4, 5, 6 mm</td>
                  <td className="py-4 px-4">Premium Exterior</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-blue-800">Areca S3</td>
                  <td className="py-4 px-4">1220 mm</td>
                  <td className="py-4 px-4">3660 mm</td>
                  <td className="py-4 px-4">2, 3, 4, 5, 6 mm</td>
                  <td className="py-4 px-4">Cladding</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-emerald-800">Skybond S1</td>
                  <td className="py-4 px-4">1220 mm</td>
                  <td className="py-4 px-4">2440 mm</td>
                  <td className="py-4 px-4">3, 6 mm</td>
                  <td className="py-4 px-4">Standard</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-emerald-800">Skybond S2</td>
                  <td className="py-4 px-4">1250 mm</td>
                  <td className="py-4 px-4">2500 mm</td>
                  <td className="py-4 px-4">3 mm</td>
                  <td className="py-4 px-4">Standard Large</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact / Enquiry Section */}
        <section className="bg-gradient-to-br from-charcoal to-black rounded-3xl shadow-lg p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Need a Custom Size?</h2>
              <p className="text-silver mb-8 text-lg">
                We can provide custom cut sizes and bulk orders tailored to your project requirements. Fill out the form and our sales team will get back to you shortly.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <Check className="w-4 h-4" />
                  </div>
                  Bulk volume discounts available
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <Check className="w-4 h-4" />
                  </div>
                  Direct factory sourcing
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <Check className="w-4 h-4" />
                  </div>
                  Pan-India delivery network
                </li>
              </ul>
            </div>
            
            <div className="bg-white text-charcoal p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-6">Request a Quote</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Sheet Brand Preference</label>
                  <select id="brand" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent outline-none transition-all bg-white">
                    <option value="">Select a Brand</option>
                    <option value="areca">Areca</option>
                    <option value="skybond">Skybond</option>
                    <option value="both">Both / Unsure</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message / Requirements</label>
                  <textarea id="message" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent outline-none transition-all resize-none" placeholder="Looking for 50 sheets of..."></textarea>
                </div>
                <button type="button" className="w-full bg-gold hover:bg-yellow-500 text-charcoal font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  Submit Enquiry
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
