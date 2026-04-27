import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'


const Footer = () => {
    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Post Resume', href: '/postres' },
        { name: 'View Jobs', href: '/viewjobs' },
        { name: 'Contact Us', href: '/contact' },
    ]

    return (
        <footer className="bg-black border-t border-gray-100 pt-16 pb-12 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >

                    {/* Brand Column */}
                    <motion.div className="space-y-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <img className="h-12 w-auto brightness-0 invert" src="/images/rcs_logo.jpg" alt="RCS Logo" />
                        <p className=" text-sm leading-relaxed text-gray-400 font-medium">
                            RCS Placement Consultancy is a premier HR Services Company devoted to human resource management, providing competent and resourceful candidates to Corporate Organizations.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <motion.a 
                                    key={i} 
                                    href="#" 
                                    className="p-2 bg-gray-900 text-gray-400 hover:bg-[#00c57d] hover:text-white rounded-lg transition-all border border-gray-800"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>


                    {/* Quick Links */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <h4 className=" font-black mb-6 uppercase tracking-widest text-[#00c57d]">Quick Links</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className=" text-gray-400 hover:text-[#00c57d] transition-colors text-sm font-bold uppercase tracking-wider">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>


                    {/* Services */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <h4 className=" font-black mb-6 uppercase tracking-widest text-[#00c57d]">Services</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Career Development', id: 'career-development' },
                                { name: 'Permanent Recruitment', id: 'permanent-recruitment' },
                                { name: 'Campus Recruitment', id: 'campus-recruitment' },
                                { name: 'IT Services', id: 'it-services' },
                                { name: 'Marketing', id: 'marketing' },
                                { name: 'Temporary Recruitment', id: 'temporary-recruitment' }
                            ].map((service) => (
                                <li key={service.id}>
                                    <Link to={`/services#${service.id}`} className=" text-gray-400 hover:text-[#00c57d] transition-colors text-sm font-bold uppercase tracking-wider">
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>


                    {/* Contact Info */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <h4 className=" font-black mb-6 uppercase tracking-widest text-[#00c57d]">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 group">
                                <MapPin className="h-5 w-5 text-[#00c57d] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className=" text-sm text-gray-400 font-medium">Building No. 645, Behind Allahabad Bank, In front of Gumanpura Thana, Aerodrome Circle, Kota-Rajasthan - 324001</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <Phone className="h-5 w-5 text-[#00c57d] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className=" text-sm text-gray-400 font-medium">+(91) 9667618794, +(91) 6378103533, +(91) 8104083002</span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <Mail className="h-5 w-5 text-[#00c57d] flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className=" text-sm text-gray-400 font-medium font-bold">r.c.sindiaconcept@gmail.com</span>
                            </li>
                        </ul>
                    </motion.div>
                </motion.div>


            
            </div>
        </footer>
    )
}

export default Footer
