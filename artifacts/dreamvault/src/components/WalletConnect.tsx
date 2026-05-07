import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Copy, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    // Fake Phantom wallet connection
    const fakeAddress = `0x${Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setWalletAddress(fakeAddress);
    setConnected(true);
    setShowDropdown(false);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setWalletAddress('');
    setShowDropdown(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {connected ? (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="glass px-4 py-2.5 rounded-xl border border-primary/30 hover:border-primary/60 flex items-center gap-2 transition-all duration-300 group"
            data-testid="button-wallet-connected"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-primary group-hover:text-primary">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </motion.button>
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 glass rounded-2xl border border-primary/30 overflow-hidden z-50 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
              >
                <div className="p-4 space-y-3">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Connected Wallet</div>
                  <div className="bg-black/30 p-3 rounded-lg border border-primary/20 break-all text-xs font-mono text-foreground/80">
                    {walletAddress}
                  </div>
                  <button
                    onClick={copyAddress}
                    className="w-full text-xs font-mono py-2 px-3 rounded-lg border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-xs font-mono py-2 px-3 rounded-lg border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className="glass border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 flex items-center gap-2 h-11 px-5 rounded-xl font-orbitron font-semibold text-sm"
          data-testid="button-connect-wallet"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
