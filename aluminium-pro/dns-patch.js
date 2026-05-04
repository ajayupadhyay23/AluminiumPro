/**
 * DNS Patch: Forces Node.js to use Google DNS (8.8.8.8)
 * so the Prisma Rust engine can resolve Neon hostnames
 * that are blocked by the local network's DNS resolver.
 */
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('[dns-patch] Using Google DNS (8.8.8.8) for Neon resolution');
