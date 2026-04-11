import React from 'react'
import { Rocket, Shield, Zap, Globe, Cpu, Headphones } from 'lucide-react'

const Features = () => {
    const features = [
        {
            title: 'Cloud Scaling',
            description: 'Effortlessly scale your infrastructure with our enterprise-grade cloud solutions.',
            icon: <Rocket className="h-8 w-8" />,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Advanced Security',
            description: 'Protect your data with multi-layer encryption and proactive threat monitoring.',
            icon: <Shield className="h-8 w-8" />,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Instant Delivery',
            description: 'Automation tools that handle your deployments in seconds, not hours.',
            icon: <Zap className="h-8 w-8" />,
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Global Network',
            description: 'Ultra-low latency with servers distributed across 50+ strategic locations.',
            icon: <Globe className="h-8 w-8" />,
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'AI Integration',
            description: 'Smart algorithms that learn and adapt to your specific business needs.',
            icon: <Cpu className="h-8 w-8" />,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: '24/7 Support',
            description: 'Our world-class engineering team is always here to keep you shipping.',
            icon: <Headphones className="h-8 w-8" />,
            color: 'bg-rose-50 text-rose-600',
        },
    ]

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Our Services</h2>
                    <p className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">Everything you need to succeed</p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We provide the tools and expertise required to build, deploy, and scale world-class applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className={`inline-flex p-4 rounded-2xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
