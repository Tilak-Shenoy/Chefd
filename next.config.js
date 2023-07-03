module.exports = {
	reactStrictMode: false,
	images: {
	 remotePatterns: [
       {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/littlecook/public_images/ingredients/**',
      }, 
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn11.bigcommerce.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net'
      }
    ],
	},
};